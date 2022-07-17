import sequelize from 'sequelize';

import Recommendation from '../../infrastructure/db/tables/recommendations';
import UsingRecommendations from '../../infrastructure/db/tables/usingRecommendations';

import {IRecommendationRepository} from '../../domain/model/recommendation/IRecommendationRepository';
import recommendationModel from '../../domain/model/recommendation/recommendationModel';
/* Sequelizeを想定 */
interface sequelize {
  Recommendation: typeof Recommendation,
  UsingRecommendations: typeof UsingRecommendations,
}

export default class RecommendationRepository implements IRecommendationRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findMaxIndex(): Promise<number> {
    return await this.db.Recommendation.max('sort_index');
  }

  public async insert(recommendationModel: recommendationModel): Promise<void> {
    await this.db.Recommendation.create({
      id: recommendationModel.Id,
      title: recommendationModel.Title,
      content: recommendationModel.Content,
      is_solid: recommendationModel.IsSolid ? 1 : 0,
      sort_index: recommendationModel.Index,
    });
  }
}
