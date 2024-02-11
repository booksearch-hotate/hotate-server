import RequestDeleteInputData from "../../presentation/dto/request/delete/RequestDeleteInputData";
import RequestFindByIdInputData from "../../presentation/dto/request/findById/RequestFindByIdInputData";
import RequestDeleteResponse from "../../presentation/response/request/RequestDeleteResponse";
import RequestFetchAllResponse from "../../presentation/response/request/RequestFetchAllResponse";
import RequestFindByIdResponse from "../../presentation/response/request/RequestFindByIdResponse";
import DeleteRequestUseCase from "../../usecase/request/DeleteRequestUsecase";
import FetchAllRequestUseCase from "../../usecase/request/FetchAllRequestUsecase";
import FindRequestUseCase from "../../usecase/request/FindRequestUsecase";

export default class BookRequestAdminController {
  private readonly fetchAllRequestUsecase: FetchAllRequestUseCase;
  private readonly findRequestUsecase: FindRequestUseCase;
  private readonly deleteRequestUsecase: DeleteRequestUseCase;

  public constructor(
      fetchAllRequestUsecase: FetchAllRequestUseCase,
      findRequestUsecase: FindRequestUseCase,
      deleteRequestUsecase: DeleteRequestUseCase,
  ) {
    this.fetchAllRequestUsecase = fetchAllRequestUsecase;
    this.findRequestUsecase = findRequestUsecase;
    this.deleteRequestUsecase = deleteRequestUsecase;
  }

  public async fetchAll(): Promise<RequestFetchAllResponse> {
    const response = new RequestFetchAllResponse();

    try {
      const output = await this.fetchAllRequestUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async findById(id: string): Promise<RequestFindByIdResponse> {
    const response = new RequestFindByIdResponse();

    try {
      const input = new RequestFindByIdInputData(id);
      const output = await this.findRequestUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async delete(id: string): Promise<RequestDeleteResponse> {
    const response = new RequestDeleteResponse();

    try {
      const input = new RequestDeleteInputData(id);

      await this.deleteRequestUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
