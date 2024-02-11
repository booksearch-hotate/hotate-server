import SearchHistoryId from "../../domain/model/searchHistory/searchHistoryId";
import {ISearchHistoryESRepository} from "../../domain/repository/es/ISearchHistoryESRepository";
import DeleteSearchHistoryInputData from "../../presentation/dto/searchHistory/delete/DeleteSearchHistoryInputData";
import {Usecase} from "../Usecase";

export default class DeleteSearchHistoryUsecase implements Usecase<DeleteSearchHistoryInputData, Promise<void>> {
  public constructor(
    private readonly searchHistoryESRepository: ISearchHistoryESRepository,
  ) {}

  public async execute(inputData: DeleteSearchHistoryInputData): Promise<void> {
    const searchHistory = await this.searchHistoryESRepository.findById(new SearchHistoryId(inputData.id));

    if (searchHistory === null) throw new Error("検索履歴が見つかりませんでした。");

    await this.searchHistoryESRepository.delete(searchHistory);
  }
}
