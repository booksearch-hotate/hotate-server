import PaginationMargin from '../pagination/paginationMarginModel';
import Recommendation from './recommendationModel';
export interface IRecommendationRepository {
  insert(recommendationModel: Recommendation): Promise<void>
  findMaxIndex(): Promise<number>
  fetch(pageCount: number, margin: PaginationMargin): Promise<Recommendation[]>
  fetchAllCount(): Promise<number>
  findById(id: string): Promise<Recommendation | null>
  update(recommendation: Recommendation): Promise<void>
  delete(recommendation: Recommendation): Promise<void>
}
