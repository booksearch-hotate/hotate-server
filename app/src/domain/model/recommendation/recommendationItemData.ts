import RecommendationItem from './recommendationItemModel';

export default class RecommendationItemData {
  private bookId: string;
  private comment: string | null;

  constructor(recommendationItemModel: RecommendationItem) {
    this.bookId = recommendationItemModel.BookId.Id;
    this.comment = recommendationItemModel.Comment;
  }

  get BookId() {
    return this.bookId;
  }

  get Comment() {
    return this.comment;
  }
}
