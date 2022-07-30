import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';
import SearchHistoryModel from '../../domain/model/searchHistory/searchHistoryModel';

import {ISearchHistoryRepository} from '../../domain/model/searchHistory/ISearchHistoryRepository';
import PaginationMarginModel from '../../domain/model/pagination/paginationMarginModel';

export default class SearchHistoryRepository implements ISearchHistoryRepository {
  private readonly esSearchHistory: EsSearchHistory;

  public constructor(esSearchHistory: EsSearchHistory) {
    this.esSearchHistory = esSearchHistory;
  }

  public async add(tar: SearchHistoryModel) {
    await this.esSearchHistory.add(tar);
  }

  public async search(words: string): Promise<SearchHistoryModel[]> {
    return await this.esSearchHistory.search(words);
  }

  public async find(count: number, margin: PaginationMarginModel): Promise<SearchHistoryModel[]> {
    return await this.esSearchHistory.find(count, margin);
  }

  public async findAllCount(): Promise<number> {
    return this.esSearchHistory.Total;
  }

  public async delete(id: string): Promise<void> {
    await this.esSearchHistory.delete(id);
  }
}
