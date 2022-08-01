import BookIdModel from '../book/bookIdModel';

export default class RecommendationItem {
  private bookId: BookIdModel;
  private comment: string | null;

  private readonly MAX_COMMENT_LEN = 100;

  constructor(bookId: BookIdModel, comment: string | null) {
    if (comment !== null && comment.length > this.MAX_COMMENT_LEN) throw new Error('Have exceeded the number of characters you can enter.');

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
