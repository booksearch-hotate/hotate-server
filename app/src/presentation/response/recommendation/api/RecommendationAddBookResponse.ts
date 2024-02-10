import BookData from "../../../dto/book/BookData";
import BookFetchOutputData from "../../../dto/book/fetchBook/BookFetchOutputData";
import TreeResponse from "../../TreeResponse";

export type RecommendationAddBookControllerOutput = {
  isExistBook: boolean,
  book: BookFetchOutputData,
}

export default class RecommendationAddBookResponse extends TreeResponse<RecommendationAddBookControllerOutput> {
  public isExistBook: boolean | null = null;
  public book: BookData | null = null;

  public success(o: RecommendationAddBookControllerOutput) {
    this.isExistBook = o.isExistBook;
    this.book = o.book.book;
    return this;
  }

  public error() {
    return this;
  }
}
