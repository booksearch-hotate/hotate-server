import BookId from "../../../../domain/model/book/bookId";

export default class TagInsertInputData {
  public bookId: BookId;
  public name: string;

  constructor(bookId: BookId, name: string) {
    this.bookId = bookId;
    this.name = name;
  }
}
