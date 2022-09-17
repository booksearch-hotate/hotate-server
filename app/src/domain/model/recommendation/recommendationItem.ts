import {DomainInvalidError} from '../../../presentation/error';
import BookId from '../book/bookId';

export default class RecommendationItem {
  private bookId: BookId;
  private comment: string | null;

  private readonly MAX_COMMENT_LEN = 100;

  constructor(bookId: BookId, comment: string | null) {
    if (comment !== null && comment.length > this.MAX_COMMENT_LEN) throw new DomainInvalidError('Have exceeded the number of characters you can enter.');

    this.bookId = bookId;
    this.comment = comment;
  }

  get Comment() {
    return this.comment;
  }

  get BookId() {
    return this.bookId;
  }
}
