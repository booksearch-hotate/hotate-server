import PaginationMargin from '../pagination/paginationMarginModel';
import SearchHistory from './searchHistoryModel';

export interface ISearchHistoryRepository {
  add (searchHistoryModel: SearchHistory): Promise<void>
  search (words: string): Promise<SearchHistory[]>
  find (count: number, margin: PaginationMargin): Promise<SearchHistory[]>
  findAllCount (): Promise<number>
  delete (id: string): Promise<void>
}
