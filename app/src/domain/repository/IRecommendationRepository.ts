import BookId from "../model/book/bookId";
import PaginationMargin from "../model/pagination/paginationMargin";
import Recommendation from "../model/recommendation/recommendation";

export interface IRecommendationRepository {
  insert(recommendationModel: Recommendation): Promise<void>
  findMaxIndex(): Promise<number>
  fetch(pageCount: number, margin: PaginationMargin): Promise<Recommendation[]>
  fetchAllCount(): Promise<number>
  findById(id: string): Promise<Recommendation | null>
  update(recommendation: Recommendation): Promise<void>
  delete(recommendation: Recommendation): Promise<void>
  findByBookId(bookId: BookId): Promise<string[]>
  removeUsingByBookId(bookId: BookId): Promise<void>
  removeUsingAll(): Promise<void>
  fetchAllThumbnailName(): string[]
}
