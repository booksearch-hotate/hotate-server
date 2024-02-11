import {IBookRequestDBRepository} from "../../domain/repository/db/IBookRequestDBRepository";
import RequestFindByIdInputData from "../../presentation/dto/request/findById/RequestFindByIdInputData";
import RequestFindByIdOutputData from "../../presentation/dto/request/findById/RequestFindByIdOutputData";
import {Usecase} from "../Usecase";

export default class FindRequestUseCase implements Usecase<RequestFindByIdInputData, Promise<RequestFindByIdOutputData>> {
  private requestDB: IBookRequestDBRepository;

  public constructor(requestDB: IBookRequestDBRepository) {
    this.requestDB = requestDB;
  }

  public async execute(input: RequestFindByIdInputData): Promise<RequestFindByIdOutputData> {
    const request = await this.requestDB.findById(input.id);

    if (request === null) throw new Error("リクエストが見つかりませんでした。");

    return new RequestFindByIdOutputData(request);
  }
}
