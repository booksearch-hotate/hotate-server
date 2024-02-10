import Book from "../../../../domain/model/book/book";
import BookData from "../BookData";

export default class BookFetchAllOutputData {
  public books: BookData[];
  public total: number;

  public constructor(books: Book[], total: number) {
    this.books = books.map((book) => {
      const data = new BookData(book);
      data.convertBookContentLength();
      return data;
    });
    this.total = total;
  }
}
