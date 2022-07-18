import sequelize from 'sequelize';

import Recommendation from '../../infrastructure/db/tables/recommendations';
import UsingRecommendations from '../../infrastructure/db/tables/usingRecommendations';
import Book from '../../infrastructure/db/tables/books';

import {IRecommendationRepository} from '../../domain/model/recommendation/IRecommendationRepository';
import RecommendationModel from '../../domain/model/recommendation/recommendationModel';
/* Sequelizeを想定 */
interface sequelize {
  Recommendation: typeof Recommendation,
  UsingRecommendations: typeof UsingRecommendations,
  Book: typeof Book,
}

export default class RecommendationRepository implements IRecommendationRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findMaxIndex(): Promise<number> {
    return await this.db.Recommendation.max('sort_index');
  }

  public async insert(recommendationModel: RecommendationModel): Promise<void> {
    await this.db.Recommendation.create({
      id: recommendationModel.Id,
      title: recommendationModel.Title,
      content: recommendationModel.Content,
      is_solid: recommendationModel.IsSolid ? 1 : 0,
      sort_index: recommendationModel.Index,
    });
  }

  public async fetch(pageCount: number): Promise<RecommendationModel[]> {
    const FETCH_DATA_NUM = 10;
    const fetchData = await this.db.Recommendation.findAll({
      limit: FETCH_DATA_NUM,
      offset: FETCH_DATA_NUM * pageCount,
    });

    console.log(fetchData);

    const res = fetchData.map(async (column) => {
      const fetchData = await this.db.UsingRecommendations.findAll({where: {recommendation_id: column.id}});

      const bookIds = fetchData === null ? [] : fetchData.map((column) => column.book_id);

      return new RecommendationModel(
          column.id,
          column.title,
          column.content,
          column.is_solid === 1 ? true : false,
          column.sort_index,
          column.created_at,
          column.updated_at,
          bookIds,
      );
    });

    return await Promise.all(res);
  }

  public async fetchAllCount(): Promise<number> {
    return await this.db.Recommendation.count();
  }
}
