import SearchHistoryModel from '../domain/model/searchHistoryModel';
import {ISearchHistoryApplicationRepository} from './repository/ISearchHistoryApplicationRepository';

export default class AdminApplicationService {
  private readonly searchHistoryApplicationRepository: ISearchHistoryApplicationRepository;

  public constructor(searchHistoryApplicationRepository: ISearchHistoryApplicationRepository) {
    this.searchHistoryApplicationRepository = searchHistoryApplicationRepository;
  }

  public async add(words: string) {
    await this.searchHistoryApplicationRepository.add(new SearchHistoryModel(words));
  }

  public async search(words: string): Promise<string[]> {
    return await this.searchHistoryApplicationRepository.search(words);
  }
}
