import {ISearchHistoryESRepository} from "../../domain/repository/es/ISearchHistoryESRepository";
import SearchHistorySearchInputData from "../../presentation/dto/searchHistory/search/SearchHistorySearchInputData";
import SearchHistorySearchOutputData from "../../presentation/dto/searchHistory/search/SearchHistorySearchOutputData";
import {Usecase} from "../Usecase";

export default class SearchHistoryUseCase implements Usecase<SearchHistorySearchInputData, Promise<SearchHistorySearchOutputData>> {
  private readonly searchHistoryES: ISearchHistoryESRepository;

  public constructor(
      searchHistoryES: ISearchHistoryESRepository,
  ) {
    this.searchHistoryES = searchHistoryES;
  }

  async execute(input: SearchHistorySearchInputData): Promise<SearchHistorySearchOutputData> {
    const searchRes = await this.searchHistoryES.search(input.word);

    return new SearchHistorySearchOutputData(searchRes);
  }
}
