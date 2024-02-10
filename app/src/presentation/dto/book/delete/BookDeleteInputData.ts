import BookId from "../../../../domain/model/book/bookId";

export default class BookDeleteInputData {
  public id: BookId;

  constructor(id: string) {
    this.id = new BookId(id);
  }
}
