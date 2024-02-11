import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import BookSearchInputData from "../../presentation/dto/book/searchBooks/BookSearchInputData";
import {Usecase} from "../Usecase";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import BookId from "../../domain/model/book/bookId";
import {IAuthorESRepository} from "../../domain/repository/es/IAuthorESRepository";
import AuthorId from "../../domain/model/author/authorId";
import {IPublisherESRepository} from "../../domain/repository/es/IPublisherESRepository";
import PublisherId from "../../domain/model/publisher/publisherId";
import BookSearchOutputData from "../../presentation/dto/book/searchBooks/BookSearchOutputData";

export default class SearchBooksUsecase implements Usecase<BookSearchInputData, Promise<BookSearchOutputData>> {
  private readonly bookDB: IBookDBRepository;
  private readonly bookES: IBookESRepository;
  private readonly authorES: IAuthorESRepository;
  private readonly publisherES: IPublisherESRepository;

  public constructor(
      bookDB: IBookDBRepository,
      bookES: IBookESRepository,
      authorES: IAuthorESRepository,
      publisherES: IPublisherESRepository,
  ) {
    this.bookDB = bookDB;
    this.bookES = bookES;
    this.authorES = authorES;
    this.publisherES = publisherES;
  }

  public async execute(input: BookSearchInputData): Promise<BookSearchOutputData> {
    let output: BookSearchOutputData;

    if (input.searchMode === "tag" && input.searchCategory === "book") {
      try {
        const res = await this.bookDB.searchByTag(input.query, input.pageCount, input.margin);
        output = new BookSearchOutputData(res.books, res.count);
      } catch (e) {
        output = new BookSearchOutputData([], 0);
      }
    } else {
      if (input.searchCategory === "author") {
        const authorRes: {ids: AuthorId[], total: number} = await this.authorES.search(
            input.query,
            input.pageCount,
            input.margin,
            input.searchMode === "strict",
        );

        const res = await this.bookDB.findByAuthorIds(authorRes.ids);

        output = new BookSearchOutputData(res, authorRes.total);
      } else if (input.searchCategory === "publisher") {
        const publisherRes: {ids: PublisherId[], total: number} = await this.publisherES.search(
            input.query,
            input.pageCount,
            input.margin,
            input.searchMode === "strict",
        );

        const res = await this.bookDB.findByPublisherIds(publisherRes.ids);

        output = new BookSearchOutputData(res, publisherRes.total);
      } else {
        const searchRes: {ids: BookId[], total: number} = await this.bookES.search(
            input.query,
            input.pageCount,
            input.margin,
            input.searchMode === "strict",
        );

        const res = await this.bookDB.findByIds(searchRes.ids);

        output = new BookSearchOutputData(res, searchRes.total);
      }
    }

    return output;
  }
}
