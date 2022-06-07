import SearchHistoryModel from '../../domain/model/searchHistoryModel';

export interface ISearchHistoryApplicationRepository {
  add (searchHistoryModel: SearchHistoryModel): Promise<void>
  search (words: string): Promise<SearchHistoryModel[]>
  find (count: number): Promise<SearchHistoryModel[]>
  findAllCount (): Promise<number>
  delete (id: string): Promise<void>
}
