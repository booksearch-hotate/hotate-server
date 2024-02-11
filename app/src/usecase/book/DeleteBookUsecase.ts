import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import BookDeleteInputData from "../../presentation/dto/book/delete/BookDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteBookUseCase implements Usecase<BookDeleteInputData, Promise<void>> {
  private bookDB: IBookDBRepository;
  private bookES: IBookESRepository;

  public constructor(bookDB: IBookDBRepository, bookES: IBookESRepository) {
    this.bookDB = bookDB;
    this.bookES = bookES;
  }

  public async execute(input: BookDeleteInputData): Promise<void> {
    const book = await this.bookDB.findById(input.id);

    if (book === null) throw new Error("本が見つかりません。");

    await Promise.all([
      this.bookDB.delete(book.book),
      this.bookES.delete(book.book),
    ]);
  }
}
