import Book from "../../../../domain/model/book/book";
import BookData from "../BookData";

export default class BookSearchOutputData {
  public books: BookData[];
  public count: number;

  public constructor(books: Book[], count: number) {
    this.books = books.map((book) => {
      const data = new BookData(book);
      data.convertBookContentLength();
      return data;
    });
    this.count = count;
  }
}
