import BookId from "../../../../domain/model/book/bookId";

export default class BookFetchInputData {
  public bookId: BookId;

  constructor(bookId: string) {
    this.bookId = new BookId(bookId);
  }
}

