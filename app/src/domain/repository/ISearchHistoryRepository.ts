import PaginationMargin from "../model/pagination/paginationMargin";
import SearchHistory from "../model/searchHistory/searchHistory";

export interface ISearchHistoryRepository {
  add (searchHistoryModel: SearchHistory): Promise<void>
  search (words: string): Promise<SearchHistory[]>
  find (count: number, margin: PaginationMargin): Promise<SearchHistory[]>
  findAllCount (): Promise<number>
  delete (id: string): Promise<void>
}
