import AuthorId from "../../../../domain/model/author/authorId";
import BookId from "../../../../domain/model/book/bookId";
import PublisherId from "../../../../domain/model/publisher/publisherId";

export default class BookUpdateInputData {
  public bookId: BookId;
  public authorId: AuthorId;
  public publisherId: PublisherId;
  public bookName: string;
  public subName: string | null;
  public content: string | null;
  public isbn: string | null;
  public ndc: number | null;
  public year: number | null;

  public constructor(
      bookId: string,
      authorId: string,
      publisherId: string,
      bookName: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
  ) {
    this.bookId = new BookId(bookId);
    this.authorId = new AuthorId(authorId);
    this.publisherId = new PublisherId(publisherId);
    this.bookName = bookName;
    this.subName = subName;
    this.content = content;
    this.isbn = isbn;
    this.ndc = ndc;
    this.year = year;
  }
}
