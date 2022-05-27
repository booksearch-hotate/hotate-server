import SearchHistoryModel from '../../domain/model/searchHistoryModel';

export interface ISearchHistoryApplicationRepository {
  add (searchHistoryModel: SearchHistoryModel): Promise<void>
  search (words: string): Promise<string[]>
}
