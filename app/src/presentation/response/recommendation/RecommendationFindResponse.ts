import BookData from "../../dto/book/BookData";
import RecommendationData from "../../dto/recommendation/RecommendationData";
import RecommendationFindOutputData from "../../dto/recommendation/find/RecommendationFindOutputData";
import TreeResponse from "../TreeResponse";

export type FindRecommendationControllerOutputData = {
  recommendation: RecommendationFindOutputData;
}

export default class RecommendationFindResponse extends TreeResponse<FindRecommendationControllerOutputData> {
  public recommendation: RecommendationData | null = null;
  public items: {
    book: BookData,
    comment: string | null,
  }[] = [];

  public success(o: FindRecommendationControllerOutputData) {
    this.recommendation = o.recommendation.recommendation;
    this.items = o.recommendation.recommendation.RecommendationItems.map((item) => {
      return {
        book: item.Book,
        comment: item.Comment,
      };
    });
    return this;
  }
}
