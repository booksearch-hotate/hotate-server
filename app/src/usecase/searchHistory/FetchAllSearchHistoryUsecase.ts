import {ISearchHistoryESRepository} from "../../domain/repository/es/ISearchHistoryESRepository";
import SearchHistoryFetchAllInputData from "../../presentation/dto/searchHistory/fetchAll/SearchHistoryFetchAllInputData";
import SearchHistoryFetchAllOutputData from "../../presentation/dto/searchHistory/fetchAll/SearchHistoryFetchAllOutputData";
import {Usecase} from "../Usecase";

export default class FetchAllSearchHistoryUseCase implements Usecase<
SearchHistoryFetchAllInputData, Promise<SearchHistoryFetchAllOutputData>
> {
  public constructor(private readonly searchHistoryES: ISearchHistoryESRepository) { }

  public async execute(input: SearchHistoryFetchAllInputData): Promise<SearchHistoryFetchAllOutputData> {
    const response = await this.searchHistoryES.fetch(input.pageCount, input.fetchMargin);

    return new SearchHistoryFetchAllOutputData(response.histories, response.total);
  }
}
