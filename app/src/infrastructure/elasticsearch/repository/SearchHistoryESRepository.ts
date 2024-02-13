import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import SearchHistory from "../../../domain/model/searchHistory/searchHistory";
import SearchHistoryId from "../../../domain/model/searchHistory/searchHistoryId";
import {ISearchHistoryESRepository} from "../../../domain/repository/es/ISearchHistoryESRepository";
import EsSearchHistory from "../esSearchHistory";

export default class SearchHistoryESRepository implements ISearchHistoryESRepository {
  private readonly esSearchHistory: EsSearchHistory;

  public constructor(esSearchHistory: EsSearchHistory) {
    this.esSearchHistory = esSearchHistory;
  }

  public async search(words: string): Promise<any> {
    return await this.esSearchHistory.searchSearchHistory(words);
  }

  public async add(word: SearchHistory): Promise<void> {
    await this.esSearchHistory.add(word);
  }

  public async findById(id: SearchHistoryId): Promise<SearchHistory | null> {
    return await this.esSearchHistory.findById(id.Id);
  }

  public async delete(word: SearchHistory): Promise<void> {
    await this.esSearchHistory.delete(word.Id.Id);
  }

  public async fetch(pageCount: number, margin: PaginationMargin): Promise<{histories: SearchHistory[], total: number}> {
    return await this.esSearchHistory.find(pageCount, margin);
  }
}
