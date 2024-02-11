import AddESByDBInputData from "../../../presentation/dto/health/addESByDB/AddESByDBInputData";
import DeleteESByDBInputData from "../../../presentation/dto/health/deleteESByDB/DeleteESByDBInputData";
import CheckDBHaveESResponse from "../../../presentation/response/health/CheckDBHaveESResponse";
import CheckESHaveDBResponse from "../../../presentation/response/health/CheckESHaveDBResponse";
import DuplicationResponse from "../../../presentation/response/health/DuplicationResponse";
import AddESByDBResponse from "../../../presentation/response/health/addESByDBResponse";
import DeleteESByDBResponse from "../../../presentation/response/health/deleteESByDBResponse";
import AddESByDBUseCase from "../../../usecase/health/addESByDBUsecase";
import CheckDBHaveESUseCase from "../../../usecase/health/checkDBHaveESUsecase";
import CheckDuplicationBooksUseCase from "../../../usecase/health/checkDuplicationBooksUsecase";
import CheckESHaveDBUsecase from "../../../usecase/health/checkESHaveDBUsecase";
import DeleteESByDBUseCase from "../../../usecase/health/deleteESByDBUsecase";

export default class HealthController {
  constructor(
    private readonly checkDuplicationBooksUsecase: CheckDuplicationBooksUseCase,
    private readonly checkDBHaveESUsecase: CheckDBHaveESUseCase,
    private readonly checkESHaveDBUsecase: CheckESHaveDBUsecase,
    private readonly addESByDBUsecase: AddESByDBUseCase,
    private readonly deleteESByDBUsecase: DeleteESByDBUseCase,
  ) {}

  public async duplicationBooks(): Promise<DuplicationResponse> {
    const response = new DuplicationResponse();

    try {
      const output = await this.checkDuplicationBooksUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async equalDBtoES(): Promise<CheckDBHaveESResponse> {
    const response = new CheckESHaveDBResponse();

    try {
      const output = await this.checkESHaveDBUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async equalEStoDB(): Promise<CheckESHaveDBResponse> {
    const response = new CheckDBHaveESResponse();

    try {
      const output = await this.checkDBHaveESUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async addESByDB(ids: string[]): Promise<AddESByDBResponse> {
    const response = new AddESByDBResponse();

    try {
      const input = new AddESByDBInputData(ids);

      await this.addESByDBUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async deleteESByDB(ids: string[]): Promise<DeleteESByDBResponse> {
    const response = new DeleteESByDBResponse();

    try {
      await this.deleteESByDBUsecase.execute(new DeleteESByDBInputData(ids));

      return response.success();
    } catch (e) {
      return response.error(e as Error);
    }
  }
}
