import PaginationMargin from "../../model/pagination/paginationMargin";
import SearchHistory from "../../model/searchHistory/searchHistory";
import SearchHistoryId from "../../model/searchHistory/searchHistoryId";

export interface ISearchHistoryESRepository {
  search(word: string): Promise<SearchHistory[]>;
  add(word: SearchHistory): Promise<void>;
  delete(word: SearchHistory): Promise<void>;
  findById(id: SearchHistoryId): Promise<SearchHistory | null>
  fetch(pageCount: number, margin: PaginationMargin): Promise<{histories: SearchHistory[], total: number}>
}
