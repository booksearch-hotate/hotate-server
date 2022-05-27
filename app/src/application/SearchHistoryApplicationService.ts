import SearchHistoryModel from '../domain/model/searchHistoryModel';
import {ISearchHistoryApplicationRepository} from './repository/ISearchHistoryApplicationRepository';

export default class AdminApplicationService {
  private readonly searchHistoryApplicationRepository: ISearchHistoryApplicationRepository;

  public constructor(searchHistoryApplicationRepository: ISearchHistoryApplicationRepository) {
    this.searchHistoryApplicationRepository = searchHistoryApplicationRepository;
  }

  public add(words: string) {
    this.searchHistoryApplicationRepository.add(new SearchHistoryModel(words));
  }
}
