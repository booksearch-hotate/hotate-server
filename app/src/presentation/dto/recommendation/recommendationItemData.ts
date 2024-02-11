import RecommendationItem from "../../../domain/model/recommendation/recommendationItem";
import BookData from "../book/BookData";

export default class RecommendationItemData {
  private book: BookData;
  private comment: string | null;

  constructor(recommendationItemModel: RecommendationItem) {
    this.book = new BookData(recommendationItemModel.Book);
    this.comment = recommendationItemModel.Comment;
  }

  get Book() {
    return this.book;
  }

  get Comment() {
    return this.comment;
  }
}
