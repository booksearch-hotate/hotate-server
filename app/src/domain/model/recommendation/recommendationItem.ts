import {DomainInvalidError} from "../../../presentation/error";
import Book from "../book/book";

export default class RecommendationItem {
  private book: Book;
  private comment: string | null;

  private readonly MAX_COMMENT_LEN = 100;

  constructor(book: Book, comment: string | null) {
    if (comment !== null && comment.length > this.MAX_COMMENT_LEN) throw new DomainInvalidError("Have exceeded the number of characters you can enter.");

    this.book = book;
    this.comment = comment;
  }

  get Comment() {
    return this.comment;
  }

  get Book() {
    return this.book;
  }
}
