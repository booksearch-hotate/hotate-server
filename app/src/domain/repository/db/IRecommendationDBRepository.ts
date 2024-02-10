import BookId from "../../model/book/bookId";
import PaginationMargin from "../../model/pagination/paginationMargin";
import Recommendation from "../../model/recommendation/recommendation";
import RecommendationId from "../../model/recommendation/recommendationId";

export interface IRecommendationDBRepository {
  findByBookId(bookId: BookId): Promise<Recommendation[]>
  fetch(pageCount: number, count: PaginationMargin): Promise<Recommendation[]>
  count(): Promise<number>
  findById(id: RecommendationId): Promise<Recommendation | null>
  fetchMaxIndex(): Promise<number>
  update(recommendation: Recommendation): Promise<void>
  save(recommendation: Recommendation): Promise<void>
  delete(recommendation: Recommendation): Promise<void>
}
