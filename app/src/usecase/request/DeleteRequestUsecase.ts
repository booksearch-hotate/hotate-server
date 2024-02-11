import {IBookRequestDBRepository} from "../../domain/repository/db/IBookRequestDBRepository";
import RequestDeleteInputData from "../../presentation/dto/request/delete/RequestDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteRequestUseCase implements Usecase<RequestDeleteInputData, Promise<void>> {
  private requestDB: IBookRequestDBRepository;

  public constructor(requestDB: IBookRequestDBRepository) {
    this.requestDB = requestDB;
  }

  public async execute(input: RequestDeleteInputData): Promise<void> {
    const bookRequest = await this.requestDB.findById(input.id);

    if (bookRequest === null) throw new Error("リクエストが見つかりませんでした。");

    await this.requestDB.delete(bookRequest);
  }
}
