import AuthorId from "../../../../domain/model/author/authorId";
import PublisherId from "../../../../domain/model/publisher/publisherId";

export default class BookSaveInputData {
  public bookName: string;
  public subName: string | null;
  public content: string | null;
  public isbn: string | null;
  public ndc: number | null;
  public year: number | null;
  public authorId: AuthorId;
  public publisherId: PublisherId;

  public constructor(
      bookName: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      authorId: string,
      publisherId: string,
  ) {
    this.bookName = bookName;
    this.subName = subName;
    this.content = content;
    this.isbn = isbn;
    this.ndc = ndc;
    this.year = year;
    this.authorId = new AuthorId(authorId);
    this.publisherId = new PublisherId(publisherId);
  }
}
