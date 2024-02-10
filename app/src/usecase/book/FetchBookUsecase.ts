import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import BookFetchEmptyOutputData from "../../presentation/dto/book/fetchBook/BookFetchEmptyOutputData";
import BookFetchInputData from "../../presentation/dto/book/fetchBook/BookFetchInputData";
import BookFetchOutputData from "../../presentation/dto/book/fetchBook/BookFetchOutputData";
import {Usecase} from "../Usecase";

export default class FetchBookUsecase implements Usecase<
BookFetchInputData,
Promise<BookFetchOutputData | BookFetchEmptyOutputData>
> {
  private readonly db: IBookDBRepository;

  public constructor(db: IBookDBRepository) {
    this.db = db;
  }

  public async execute(input: BookFetchInputData): Promise<BookFetchOutputData | BookFetchEmptyOutputData> {
    const findRes = await this.db.findById(input.bookId);
    if (findRes === null) return new BookFetchEmptyOutputData();

    const book = findRes.book;
    const recommendations = findRes.recommendations;

    return new BookFetchOutputData(book, recommendations);
  }
}
