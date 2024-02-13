import BookData from "../book/bookData";
import RecommendationData from "../../../presentation/dto/recommendation/RecommendationData";

export interface IRecommendationObj {
  recommendation: RecommendationData,
  items: {
    book: BookData,
    comment: string | null,
  }[],
}
