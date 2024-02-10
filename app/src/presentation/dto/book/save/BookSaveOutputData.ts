import BookId from "../../../../domain/model/book/bookId";

export default class BookSaveOutputData {
  public bookId: string;

  public constructor(bookId: BookId) {
    this.bookId = bookId.Id;
  }
}
