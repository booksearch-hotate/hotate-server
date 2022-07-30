import PaginationMarginModel from '../pagination/paginationMarginModel';
import SearchHistoryModel from './searchHistoryModel';

export interface ISearchHistoryRepository {
  add (searchHistoryModel: SearchHistoryModel): Promise<void>
  search (words: string): Promise<SearchHistoryModel[]>
  find (count: number, margin: PaginationMarginModel): Promise<SearchHistoryModel[]>
  findAllCount (): Promise<number>
  delete (id: string): Promise<void>
}
