import {v4 as uuidv4} from 'uuid';
import RecommendationModel from '../model/recommendation/recommendationModel';

export default class RecommendationService {
  private readonly MAX_HAVING_BOOK_COUNT = 2;

  public createUUID(): string {
    return uuidv4();
  }

  public isOverNumberOfBooks(recommendation: RecommendationModel) {
    return recommendation.BookIds.length > this.MAX_HAVING_BOOK_COUNT;
  }
}
