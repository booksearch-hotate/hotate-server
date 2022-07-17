import RecommendationModel from './recommendationModel';
export interface IRecommendationRepository {
  insert(recommendationModel: RecommendationModel): Promise<void>
  findMaxIndex(): Promise<number>
}
