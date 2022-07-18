import RecommendationModel from './recommendationModel';
export interface IRecommendationRepository {
  insert(recommendationModel: RecommendationModel): Promise<void>
  findMaxIndex(): Promise<number>
  fetch(pageCount: number, count: number): Promise<RecommendationModel[]>
  fetchAllCount(): Promise<number>
  findById(id: string): Promise<RecommendationModel | null>
  update(recommendation: RecommendationModel): Promise<void>
  delete(recommendation: RecommendationModel): Promise<void>
}
