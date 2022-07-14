import SearchHistoryModel from '../domain/model/searchHistoryModel';
import {ISearchHistoryApplicationRepository} from './repository/ISearchHistoryApplicationRepository';
import SearchHistoryService from '../domain/service/searchHistoryService';
import SearchHistoryData from '../presentation/mapper/searchHistoryData';

export default class SearchHistoryApplicationService {
  private readonly searchHistoryApplicationRepository: ISearchHistoryApplicationRepository;
  private readonly searchHistoryService: SearchHistoryService;

  public constructor(searchHistoryApplicationRepository: ISearchHistoryApplicationRepository, searchHistoryService: SearchHistoryService) {
    this.searchHistoryApplicationRepository = searchHistoryApplicationRepository;
    this.searchHistoryService = searchHistoryService;
  }

  public async add(words: string) {
    const id = this.searchHistoryService.createUUID();
    await this.searchHistoryApplicationRepository.add(new SearchHistoryModel(id, words, new Date()));
  }

  public async search(words: string): Promise<SearchHistoryData[]> {
    const res = await this.searchHistoryApplicationRepository.search(words);
    return res.map((tar) => new SearchHistoryData(tar));
  }

  public async find(count: number): Promise<SearchHistoryData[]> {
    const res = await this.searchHistoryApplicationRepository.find(count);
    return res.map((tar) => new SearchHistoryData(tar));
  }

  public async findAllCount(): Promise<number> {
    return await this.searchHistoryApplicationRepository.findAllCount();
  }

  public async delete(id: string): Promise<void> {
    await this.searchHistoryApplicationRepository.delete(id);
  }
}
