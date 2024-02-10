import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import BookUpdateInputData from "../../presentation/dto/book/update/BookUpdateInputData";
import {Usecase} from "../Usecase";

export default class UpdateBookUsecase implements Usecase<BookUpdateInputData, Promise<void>> {
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

  public async execute(input: BookUpdateInputData): Promise<void> {
    const bookAndRecommendation = await this.bookDB.findById(input.bookId);
    if (bookAndRecommendation === null) throw new Error("本IDが異なっているため、更新することができません。");

    const book = bookAndRecommendation.book;

    const author = await this.authorDB.findById(input.authorId);
    if (author === null) throw new Error("著者が見つかりませんでした。");

    const publisher = await this.publisherDB.findById(input.publisherId);
    if (publisher === null) throw new Error("出版社が見つかりませんでした。");

    book.changeAuthor(author);
    book.changePublisher(publisher);
    book.changeName(input.bookName);
    book.changeSubName(input.subName);
    book.changeContent(input.content);
    book.changeIsbn(input.isbn);
    book.changeNdc(input.ndc);
    book.changeYear(input.year);

    Promise.all([this.bookDB.update(book), this.bookES.update(book)]);
  }
}
