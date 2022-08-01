import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';
import SearchHistory from '../../domain/model/searchHistory/searchHistory';

import {ISearchHistoryRepository} from '../../domain/model/searchHistory/ISearchHistoryRepository';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';

export default class SearchHistoryRepository implements ISearchHistoryRepository {
  private readonly esSearchHistory: EsSearchHistory;

  public constructor(esSearchHistory: EsSearchHistory) {
    this.esSearchHistory = esSearchHistory;
  }

  public async add(tar: SearchHistory) {
    await this.esSearchHistory.add(tar);
  }

  public async search(words: string): Promise<SearchHistory[]> {
    return await this.esSearchHistory.search(words);
  }

  public async find(count: number, margin: PaginationMargin): Promise<SearchHistory[]> {
    return await this.esSearchHistory.find(count, margin);
  }

  public async findAllCount(): Promise<number> {
    return this.esSearchHistory.Total;
  }

  public async delete(id: string): Promise<void> {
    await this.esSearchHistory.delete(id);
  }
}
