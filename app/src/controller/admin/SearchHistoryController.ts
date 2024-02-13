import DeleteSearchHistoryInputData from "../../presentation/dto/searchHistory/delete/DeleteSearchHistoryInputData";
import SearchHistoryFetchAllInputData from "../../presentation/dto/searchHistory/fetchAll/SearchHistoryFetchAllInputData";
import SearchHistoryDeleteResponse from "../../presentation/response/searchHistory/SearchHistoryDeleteResponse";
import SearchHistoryIndexResponse from "../../presentation/response/searchHistory/SearchHistoryIndexResponse";
import DeleteSearchHistoryUsecase from "../../usecase/searchHistory/DeleteSearchHistoryUsecase";
import FetchAllSearchHistoryUseCase from "../../usecase/searchHistory/FetchAllSearchHistoryUsecase";

export default class SearchHistoryAdminController {
  constructor(
      private readonly fetchAllSearchHistoryUsecase: FetchAllSearchHistoryUseCase,
      private readonly deleteSearchHistoryUsecase: DeleteSearchHistoryUsecase,
  ) {}

  public async index(pageCount: number, fetchMargin: number): Promise<SearchHistoryIndexResponse> {
    const response = new SearchHistoryIndexResponse();

    try {
      const input = new SearchHistoryFetchAllInputData(pageCount, fetchMargin);

      const output = await this.fetchAllSearchHistoryUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async delete(id: string): Promise<SearchHistoryDeleteResponse> {
    const response = new SearchHistoryDeleteResponse();

    try {
      const input = new DeleteSearchHistoryInputData(id);
      await this.deleteSearchHistoryUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
