import BookData from '../book/bookData';
import RecommendationData from './recommendationData';

export interface IRecommendationObj {
  recommendation: RecommendationData,
  items: {
    book: BookData,
    comment: string | null,
  }[],
}
