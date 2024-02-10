import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import CheckDuplicationBooksOutputData from "../../presentation/dto/health/checkDuplicationBooks/CheckDuplicationBooksOutputData";
import {Usecase} from "../Usecase";

export default class CheckDuplicationBooksUseCase implements Usecase<void, Promise<CheckDuplicationBooksOutputData>> {
  constructor(private readonly bookDB: IBookDBRepository) {}

  public async execute(): Promise<CheckDuplicationBooksOutputData> {
    const bookNames = await this.bookDB.findDuplicateBookNames();

    return new CheckDuplicationBooksOutputData(bookNames);
  }
}
