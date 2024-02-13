import Book from "../../domain/model/book/book";
import BookId from "../../domain/model/book/bookId";
import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import BookSaveInputData from "../../presentation/dto/book/save/BookSaveInputData";
import BookSaveOutputData from "../../presentation/dto/book/save/BookSaveOutputData";
import {Usecase} from "../Usecase";

export default class SaveBookUseCase implements Usecase<BookSaveInputData, Promise<BookSaveOutputData>> {
  private readonly bookDB: IBookDBRepository;
  private readonly bookES: IBookESRepository;
  private readonly authorDB: IAuthorDBRepository;
  private readonly publisherDB: IPublisherDBRepository;

  public constructor(
      bookDB: IBookDBRepository,
      bookES: IBookESRepository,
      authorDB: IAuthorDBRepository,
      publisherDB: IPublisherDBRepository,
  ) {
    this.bookDB = bookDB;
    this.bookES = bookES;
    this.authorDB = authorDB;
    this.publisherDB = publisherDB;
  }

  public async execute(input: BookSaveInputData): Promise<BookSaveOutputData> {
    const author = await this.authorDB.findById(input.authorId);
    const publisher = await this.publisherDB.findById(input.publisherId);

    if (author === null) throw new Error("著者が見つかりませんでした。");
    if (publisher === null) throw new Error("出版社が見つかりませんでした。");

    const book = new Book(
        new BookId(null),
        input.bookName,
        input.subName,
        input.content,
        input.isbn,
        input.ndc,
        input.year,
        author,
        publisher,
        [],
    );

    await Promise.all([this.bookDB.save(book), this.bookES.save(book)]);

    return new BookSaveOutputData(book.Id);
  }
}
