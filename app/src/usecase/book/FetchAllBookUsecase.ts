import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import BookFetchAllInputData from "../../presentation/dto/book/fetchAll/BookFetchAllInputData";
import BookFetchAllOutputData from "../../presentation/dto/book/fetchAll/BookFetchAllOutputData";
import {Usecase} from "../Usecase";

export default class FetchAllBookUseCase implements Usecase<BookFetchAllInputData, Promise<BookFetchAllOutputData>> {
  private bookDB: IBookDBRepository;

  public constructor(bookDB: IBookDBRepository) {
    this.bookDB = bookDB;
  }

  public async execute(input: BookFetchAllInputData): Promise<BookFetchAllOutputData> {
    const books = await this.bookDB.findAll(input.pageCount, input.margin);
    const total = await this.bookDB.countAll();

    return new BookFetchAllOutputData(books, total);
  }
}
