import BookId from '../book/bookId';
import PaginationMargin from '../pagination/paginationMargin';
import Recommendation from './recommendation';

export interface IRecommendationRepository {
  insert(recommendationModel: Recommendation): Promise<void>
  findMaxIndex(): Promise<number>
  fetch(pageCount: number, margin: PaginationMargin): Promise<Recommendation[]>
  fetchAllCount(): Promise<number>
  findById(id: string): Promise<Recommendation | null>
  update(recommendation: Recommendation): Promise<void>
  delete(recommendation: Recommendation): Promise<void>
<<<<<<< HEAD
  findByBookId(bookId: BookId): Promise<string[]>
=======
  findByBookId(bookId: BookId): Promise<string | null>
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
  removeUsingByBookId(bookId: BookId): Promise<void>
  removeUsingAll(): Promise<void>
  fetchAllThumbnailName(): string[]
}
