import Author from "../../domain/model/author/author";
import AuthorId from "../../domain/model/author/authorId";
import Book from "../../domain/model/book/book";
import BookId from "../../domain/model/book/bookId";
import Publisher from "../../domain/model/publisher/publisher";
import PublisherId from "../../domain/model/publisher/publisherId";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import BookSaveManyInputData from "../../presentation/dto/book/saveMany/BookSaveManyInputData";
import {Usecase} from "../Usecase";

import Logger from "../../infrastructure/logger/logger";

export default class SaveManyBooksUsecase implements Usecase<BookSaveManyInputData, Promise<any>> {
  private readonly bookDB: IBookDBRepository;
  private readonly bookES: IBookESRepository;
  private readonly logger = new Logger("SaveManyBooksUsecase");

  public constructor(bookDB: IBookDBRepository, bookES: IBookESRepository) {
    this.bookDB = bookDB;
    this.bookES = bookES;
  }

  public async execute(input: BookSaveManyInputData): Promise<any> {
    const books: Book[] = [];

    for (const inputData of input.dataList) {
      try {
        const author = new Author(new AuthorId(inputData.authorId), inputData.authorName);
        const publisher = new Publisher(new PublisherId(inputData.publisherId), inputData.publisherName);

        if (author.Name === null) throw new Error("著者名がnullです。");
        if (publisher.Name === null) throw new Error("出版社名がnullです。");

        const book = new Book(
            new BookId(null),
            inputData.bookName,
            inputData.subName,
            inputData.content,
            inputData.isbn,
            inputData.ndc,
            inputData.year,
            author,
            publisher,
            [],
        );

        books.push(book);
      } catch (e: any) {
        this.logger.warn(`${inputData.bookName}の登録に失敗しました。エラーの内容：${e.message}`);
      }
    }

    await Promise.all([this.bookDB.saveMany(books), this.bookES.saveMany(books)]);
  }
}
