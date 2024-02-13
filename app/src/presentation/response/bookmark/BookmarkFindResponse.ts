import BookData from "../../dto/book/BookData";
import TreeResponse from "../TreeResponse";

export type BookmarkFindControllerOutputData = {
  books: BookData[]
}

export default class BookmarkFindResponse extends TreeResponse<BookmarkFindControllerOutputData> {
  public books: BookData[] = [];
  public success(o: BookmarkFindControllerOutputData) {
    this.books = o.books;

    return this;
  }

  public error() {
    return this;
  }
}
