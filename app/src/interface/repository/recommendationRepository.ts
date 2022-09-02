import sequelize from 'sequelize';

import RecommendationTable from '../../infrastructure/db/tables/recommendations';
import UsingRecommendationsTable from '../../infrastructure/db/tables/usingRecommendations';
import BookTable from '../../infrastructure/db/tables/books';

import {IRecommendationRepository} from '../../domain/model/recommendation/IRecommendationRepository';
import Recommendation from '../../domain/model/recommendation/recommendation';
import RecommendationItem from '../../domain/model/recommendation/recommendationItem';
import BookId from '../../domain/model/book/bookId';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';

/* Sequelizeを想定 */
interface sequelize {
  Recommendation: typeof RecommendationTable,
  UsingRecommendations: typeof UsingRecommendationsTable,
  Book: typeof BookTable,
}

export default class RecommendationRepository implements IRecommendationRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findMaxIndex(): Promise<number> {
    return await this.db.Recommendation.max('sort_index');
  }

  public async insert(recommendationModel: Recommendation): Promise<void> {
    await this.db.Recommendation.create({
      id: recommendationModel.Id,
      title: recommendationModel.Title,
      content: recommendationModel.Content,
      is_solid: recommendationModel.IsSolid ? 1 : 0,
      sort_index: recommendationModel.SortIndex,
    });
  }

  public async fetch(pageCount: number, margin: PaginationMargin): Promise<Recommendation[]> {
    const FETCH_DATA_NUM = margin.Margin;
    const fetchData = await this.db.Recommendation.findAll({
      limit: FETCH_DATA_NUM,
      offset: FETCH_DATA_NUM * pageCount,
      order: [['is_solid', 'DESC'], ['sort_index', 'DESC']],
    });

    const res = fetchData.map(async (column) => {
      const fetchData = await this.db.UsingRecommendations.findAll({where: {recommendation_id: column.id}});

      const items = fetchData === null ? [] : fetchData.map((column) => new RecommendationItem(new BookId(column.book_id), column.comment));

      return new Recommendation(
          column.id,
          column.title,
          column.content,
          column.is_solid === 1,
          column.sort_index,
          column.created_at,
          column.updated_at,
          items,
      );
    });

    return await Promise.all(res);
  }

  public async fetchAllCount(): Promise<number> {
    return await this.db.Recommendation.count();
  }

  public async findById(id: string): Promise<Recommendation | null> {
    const fetchData = await this.db.Recommendation.findOne({where: {id}});

    if (fetchData === null) return null;

    const fetchBooks = await this.db.UsingRecommendations.findAll({where: {recommendation_id: id}});

    const items = fetchBooks.map((column) => new RecommendationItem(new BookId(column.book_id), column.comment));

    return new Recommendation(
        fetchData.id,
        fetchData.title,
        fetchData.content,
        fetchData.is_solid === 1,
        fetchData.sort_index,
        fetchData.created_at,
        fetchData.updated_at,
        items,
    );
  }

  public async update(recommendation: Recommendation): Promise<void> {
    const settingBooks = async () => {
      await this.db.UsingRecommendations.destroy({where: {recommendation_id: recommendation.Id}});

      await this.db.UsingRecommendations.bulkCreate(recommendation.RecommendationItems.map((item) => {
        return {
          recommendation_id: recommendation.Id,
          book_id: item.BookId.Id,
          comment: item.Comment,
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

  public async delete(recommendation: Recommendation): Promise<void> {
    await this.db.UsingRecommendations.destroy({where: {recommendation_id: recommendation.Id}});

    await this.db.Recommendation.decrement('sort_index', {
      where: {sort_index: {[sequelize.Op.gt]: recommendation.SortIndex}},
    });

    await this.db.Recommendation.destroy({where: {id: recommendation.Id}});
  }

  public async findByBookId(bookId: BookId): Promise<string | null> {
    const recommendationId = await this.db.UsingRecommendations.findOne({
      where: {book_id: bookId.Id},
      order: [['id', 'DESC']],
    });

    if (recommendationId === null) return null;

    return recommendationId.recommendation_id;
  }
}
