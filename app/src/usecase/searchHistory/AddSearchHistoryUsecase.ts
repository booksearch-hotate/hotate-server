import SearchHistory from "../../domain/model/searchHistory/searchHistory";
import SearchHistoryId from "../../domain/model/searchHistory/searchHistoryId";
import {ISearchHistoryESRepository} from "../../domain/repository/es/ISearchHistoryESRepository";
import SearchHistoryAddInputData from "../../presentation/dto/searchHistory/add/SearchHistoryAddInputData";
import {Usecase} from "../Usecase";

export default class AddSearchHistoryUseCase implements Usecase<SearchHistoryAddInputData, void> {
  constructor(
    private readonly searchHistoryES: ISearchHistoryESRepository,
  ) {}

  public async execute(input: SearchHistoryAddInputData): Promise<void> {
    const searchHistory = new SearchHistory(new SearchHistoryId(null), input.word, new Date());
    await this.searchHistoryES.add(searchHistory);
  }
}
