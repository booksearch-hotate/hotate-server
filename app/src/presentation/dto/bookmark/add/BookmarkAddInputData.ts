import BookId from "../../../../domain/model/book/bookId";

export default class BookmarkAddInputData {
  public bookId: BookId;
  public userId: number;

  public constructor(bookId: string, userId: number) {
    this.bookId = new BookId(bookId);
    this.userId = userId;
  }
}
