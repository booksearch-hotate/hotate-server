import BookFetchOutputData from "../../dto/book/fetchBook/BookFetchOutputData";
import BookSearchOutputData from "../../dto/book/searchBooks/BookSearchOutputData";
import TreeResponse from "../TreeResponse";

export type BookFetchControllerOutputData = {
  book: BookFetchOutputData;
  nearCategoryBooks?: BookSearchOutputData;
};

export default class FetchBookResponse extends TreeResponse<BookFetchControllerOutputData> {
  public book: BookFetchOutputData | null = null;
  public nearCategoryBooks: BookSearchOutputData | null = null;

  public success(BookFetchControllerOutputData: BookFetchControllerOutputData) {
    this.book = BookFetchControllerOutputData.book;
    if (BookFetchControllerOutputData.nearCategoryBooks !== undefined) {
      this.nearCategoryBooks = BookFetchControllerOutputData.nearCategoryBooks;
    }
    return this;
  }
}
