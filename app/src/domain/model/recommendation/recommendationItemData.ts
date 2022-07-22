import RecommendationItemModel from './recommendationItemModel';

export default class RecommendationItemData {
  private bookId: string;
  private comment: string | null;

  constructor(recommendationItemModel: RecommendationItemModel) {
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
