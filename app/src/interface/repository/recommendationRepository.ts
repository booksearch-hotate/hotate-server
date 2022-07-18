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
      sort_index: recommendationModel.SortIndex,
    });
  }

  public async fetch(pageCount: number): Promise<RecommendationModel[]> {
    const FETCH_DATA_NUM = 10;
    const fetchData = await this.db.Recommendation.findAll({
      limit: FETCH_DATA_NUM,
      offset: FETCH_DATA_NUM * pageCount,
      order: [['is_solid', 'DESC'], ['sort_index', 'DESC']],
    });

    const res = fetchData.map(async (column) => {
      const fetchData = await this.db.UsingRecommendations.findAll({where: {recommendation_id: column.id}});

      const bookIds = fetchData === null ? [] : fetchData.map((column) => column.book_id);

      return new RecommendationModel(
          column.id,
          column.title,
          column.content,
          column.is_solid === 1,
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

  public async findById(id: string): Promise<RecommendationModel | null> {
    const fetchData = await this.db.Recommendation.findOne({where: {id}});

    if (fetchData === null) return null;

    const fetchBooks = await this.db.UsingRecommendations.findAll({where: {recommendation_id: id}});

    const bookIds = fetchData === null ? [] : fetchBooks.map((column) => column.book_id);

    return new RecommendationModel(
        fetchData.id,
        fetchData.title,
        fetchData.content,
        fetchData.is_solid === 1,
        fetchData.sort_index,
        fetchData.created_at,
        fetchData.updated_at,
        bookIds,
    );
  }

  public async update(recommendation: RecommendationModel): Promise<void> {
    const settingBooks = async () => {
      await this.db.UsingRecommendations.destroy({where: {recommendation_id: recommendation.Id}});

      await this.db.UsingRecommendations.bulkCreate(recommendation.BookIds.map((bookId) => {
        return {
          recommendation_id: recommendation.Id,
          book_id: bookId,
        };
      }));
    };

    const settingSortIndex = async () => {
      /* ソート順の調整 */
      const beforeData = await this.db.Recommendation.findOne({where: {id: recommendation.Id}});

      if (beforeData === null) throw new Error('Cannnot find recommendation section.');

      const beforeSortIndex = beforeData.sort_index;
      const updateSortIndex = recommendation.SortIndex;

      // 固定化してるのにソート順が固定されている場合、無効化
      if (recommendation.IsSolid && (beforeSortIndex !== updateSortIndex)) {
        recommendation.changeSortIndex(beforeSortIndex);
        return;
      }

      if (beforeSortIndex > updateSortIndex) {
        await this.db.Recommendation.increment('sort_index', {
          where: {sort_index: {[sequelize.Op.between]: [updateSortIndex, beforeSortIndex - 1]}},
        });
      } else if (updateSortIndex > beforeSortIndex) {
        await this.db.Recommendation.decrement('sort_index', {
          where: {sort_index: {[sequelize.Op.between]: [beforeSortIndex + 1, updateSortIndex]}},
        });
      }
    };

    const settingIsSolid = async () => {
      if (!recommendation.IsSolid) return;

      await this.db.Recommendation.update({is_solid: 0}, {where: {}});
    };

    await Promise.all([settingBooks(), settingSortIndex(), settingIsSolid()]);

    await this.db.Recommendation.update({
      title: recommendation.Title,
      content: recommendation.Content,
      sort_index: recommendation.SortIndex,
      is_solid: recommendation.IsSolid ? 1 : 0,
    }, {where: {id: recommendation.Id}});
  }

  public async delete(recommendation: RecommendationModel): Promise<void> {
    await this.db.UsingRecommendations.destroy({where: {recommendation_id: recommendation.Id}});

    await this.db.Recommendation.decrement('sort_index', {
      where: {sort_index: {[sequelize.Op.gt]: recommendation.SortIndex}},
    });

    await this.db.Recommendation.destroy({where: {id: recommendation.Id}});
  }
}
