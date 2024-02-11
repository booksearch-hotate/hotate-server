import Book from "../../../../domain/model/book/book";
import BookData from "../../book/BookData";

export default class BookmarkFindOutputData {
  public books: BookData[];

  public constructor(books: Book[]) {
    this.books = books.map((book) => {
      const data = new BookData(book);
      data.convertBookContentLength();
      return data;
    });
  }
}
