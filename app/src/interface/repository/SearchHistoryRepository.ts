import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';
import SearchHistoryModel from '../../domain/model/searchHistoryModel';

import {ISearchHistoryApplicationRepository} from '../../application/repository/ISearchHistoryApplicationRepository';

export default class SearchHistoryRepository implements ISearchHistoryApplicationRepository {
  private readonly esSearchHistory: EsSearchHistory;

  public constructor(searchHistoryModel: EsSearchHistory) {
    this.esSearchHistory = searchHistoryModel;
  }

  public async add(tar: SearchHistoryModel) {
    this.esSearchHistory.add(tar);
  }

  public async search(words: string): Promise<SearchHistoryModel[]> {
    return this.esSearchHistory.search(words);
  }

  public async find(count: number): Promise<SearchHistoryModel[]> {
    return this.esSearchHistory.find(count);
  }

  public async delete(id: string): Promise<void> {
    await this.esSearchHistory.delete(id);
  }
}
