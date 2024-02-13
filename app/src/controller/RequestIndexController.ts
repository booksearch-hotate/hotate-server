import BookRequestData from "../presentation/dto/request/bookRequestData";
import RequestMakeInputData from "../presentation/dto/request/makeRequestData/RequestMakeInputData";
import RequestSaveInputData from "../presentation/dto/request/save/RequestSaveInputData";
import RequestMakeDataResponse from "../presentation/response/request/RequestMakeDataResponse";
import RequestSaveResponse from "../presentation/response/request/RequestSaveResponse";
import RequestSetFormResponse from "../presentation/response/request/RequestSetFormResponse";
import MakeRequestDataUsecase from "../usecase/request/MakeRequestDataUsecase";
import SaveRequestUsecase from "../usecase/request/SaveRequestUsecase";
import SetRequestUseCase from "../usecase/request/SetRequestUsecase";

export default class RequestIndexController {
  private readonly setRequestUsecase: SetRequestUseCase;
  private readonly makeRequestDataUsecase: MakeRequestDataUsecase;
  private readonly saveRequestUsecase: SaveRequestUsecase;

  public constructor(
      setRequestUsecase: SetRequestUseCase,
      makeRequestDataUsecase: MakeRequestDataUsecase,
      saveRequestUsecase: SaveRequestUsecase,
  ) {
    this.setRequestUsecase = setRequestUsecase;
    this.makeRequestDataUsecase = makeRequestDataUsecase;
    this.saveRequestUsecase = saveRequestUsecase;
  }

  public async setRequest(): Promise<RequestSetFormResponse> {
    const request = new RequestSetFormResponse();

    try {
      const data = await this.setRequestUsecase.execute();

      return request.success({department: data});
    } catch (e) {
      return request.error();
    }
  }
  public async makeData(
      bookName: string,
      authorName: string,
      publisherName: string,
      isbn: string,
      message: string,
      departmentId: string,
      schoolYear: number,
      schoolClass: number,
      userName: string,
  ): Promise<RequestMakeDataResponse> {
    const response = new RequestMakeDataResponse();

    try {
      const inputData = new RequestMakeInputData(
          bookName,
          authorName,
          publisherName,
          isbn,
          message,
          departmentId,
          schoolYear,
          schoolClass,
          userName,
      );

      const outputData = await this.makeRequestDataUsecase.execute(inputData);

      return response.success({data: outputData});
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async save(
      data: BookRequestData,
  ) {
    const res = new RequestSaveResponse();
    try {
      const input = new RequestSaveInputData(data);

      await this.saveRequestUsecase.execute(input);

      return res.success();
    } catch (e) {
      return res.error();
    }
  }
}
