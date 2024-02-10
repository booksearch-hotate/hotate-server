import {IBookRequestDBRepository} from "../../domain/repository/db/IBookRequestDBRepository";
import BookRequestFetchAllOutputData from "../../presentation/dto/request/fetchAll/BookRequestFetchAllOutputData";
import {Usecase} from "../Usecase";

export default class FetchAllRequestUseCase implements Usecase<void, Promise<BookRequestFetchAllOutputData>> {
  private requestDB: IBookRequestDBRepository;

  public constructor(requestDB: IBookRequestDBRepository) {
    this.requestDB = requestDB;
  }

  public async execute(): Promise<BookRequestFetchAllOutputData> {
    const output = await this.requestDB.fetchAll();

    return new BookRequestFetchAllOutputData(output);
  }
}
