import glob from 'glob';
import appRoot from 'app-root-path';
import path from 'path';

import {IRecommendationRepository} from '../../domain/model/recommendation/IRecommendationRepository';
import Recommendation from '../../domain/model/recommendation/recommendation';
import RecommendationItem from '../../domain/model/recommendation/recommendationItem';
import BookId from '../../domain/model/book/bookId';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import {PrismaClient} from '@prisma/client';

export default class RecommendationRepository implements IRecommendationRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findMaxIndex(): Promise<number> {
    // return await this.db.recommendations.max('sort_index');
    const maxIndex = await this.db.recommendations.findFirst({
      select: {
        sort_index: true,
      },
      orderBy: {
        sort_index: 'desc',
      },
    });

    return maxIndex === null ? 0 : maxIndex.sort_index;
  }

  public async insert(recommendationModel: Recommendation): Promise<void> {
    await this.db.recommendations.create({
      data: {
        id: recommendationModel.Id,
        title: recommendationModel.Title,
        content: recommendationModel.Content,
        is_solid: recommendationModel.IsSolid ? 1 : 0,
        sort_index: recommendationModel.SortIndex,
        thumbnail_name: recommendationModel.ThumbnailName,
      },
    });
  }

  public async fetch(pageCount: number, margin: PaginationMargin): Promise<Recommendation[]> {
    const FETCH_DATA_NUM = margin.Margin;

    const fetchData = await this.db.recommendations.findMany({
      take: FETCH_DATA_NUM,
      skip: FETCH_DATA_NUM * pageCount,
      orderBy: [
        {is_solid: 'desc'},
        {sort_index: 'desc'},
      ],
      include: {
        using_recommendations: true,
      },
    });

    const res = fetchData.map(async (column) => {
      const items = fetchData === null ? [] : column.using_recommendations.map((column) => new RecommendationItem(new BookId(column.book_id), column.comment));

      return new Recommendation(
          column.id,
          column.title,
          column.content,
          column.is_solid === 1,
          column.sort_index,
          column.thumbnail_name,
          column.created_at,
          column.updated_at,
          items,
      );
    });

    return await Promise.all(res);
  }

  public async fetchAllCount(): Promise<number> {
    return await this.db.recommendations.count();
  }

  public async findById(id: string): Promise<Recommendation | null> {
    const fetchData = await this.db.recommendations.findFirst({where: {id}, include: {using_recommendations: true}});

    if (fetchData === null) return null;

    const items = fetchData.using_recommendations.map((column) => new RecommendationItem(new BookId(column.book_id), column.comment));

    return new Recommendation(
        fetchData.id,
        fetchData.title,
        fetchData.content,
        fetchData.is_solid === 1,
        fetchData.sort_index,
        fetchData.thumbnail_name,
        fetchData.created_at,
        fetchData.updated_at,
        items,
    );
  }

  public async update(recommendation: Recommendation): Promise<void> {
    const settingBooks = async () => {
      await this.db.using_recommendations.deleteMany({where: {recommendation_id: recommendation.Id}});

      await this.db.using_recommendations.createMany({
        data: recommendation.RecommendationItems.map((item) => {
          return {
            recommendation_id: recommendation.Id,
            book_id: item.BookId.Id,
            comment: item.Comment,
          };
        }),
      });
    };

    const settingSortIndex = async () => {
      /* ソート順の調整 */
      const beforeData = await this.db.recommendations.findFirst({where: {id: recommendation.Id}});

      if (beforeData === null) throw new MySQLDBError('Could not find recommendation section.');

      const beforeSortIndex = beforeData.sort_index;
      const updateSortIndex = recommendation.SortIndex;

      // 固定化してるのにソート順が固定されている場合、無効化
      if (recommendation.IsSolid && (beforeSortIndex !== updateSortIndex)) {
        recommendation.changeSortIndex(beforeSortIndex);
        return;
      }

      if (beforeSortIndex > updateSortIndex) {
        // await this.db.recommendations.increment('sort_index', {
        //   where: {sort_index: {[sequelize.Op.between]: [updateSortIndex, beforeSortIndex - 1]}},
        // });

        await this.db.recommendations.updateMany({
          where: {
            sort_index: {
              gte: updateSortIndex,
              lte: beforeSortIndex - 1,
            },
          },
          data: {
            sort_index: {
              increment: 1,
            },
          },
        });
      } else if (updateSortIndex > beforeSortIndex) {
        await this.db.recommendations.updateMany({
          where: {
            sort_index: {
              gte: beforeSortIndex + 1,
              lte: updateSortIndex,
            },
          },
          data: {
            sort_index: {
              decrement: 1,
            },
          },
        });
      }
    };

    const settingIsSolid = async () => {
      if (!recommendation.IsSolid) return;

      await this.db.recommendations.updateMany({
        where: {},
        data: {
          is_solid: 0,
        },
      });
    };

    await Promise.all([settingBooks(), settingSortIndex(), settingIsSolid()]);

    await this.db.recommendations.update({
      where: {
        id: recommendation.Id,
      },
      data: {
        title: recommendation.Title,
        content: recommendation.Content,
        sort_index: recommendation.SortIndex,
        is_solid: recommendation.IsSolid ? 1 : 0,
        thumbnail_name: recommendation.ThumbnailName,
      },
    });
  }

  public async delete(recommendation: Recommendation): Promise<void> {
    await this.db.recommendations.updateMany({
      where: {
        sort_index: {
          gt: recommendation.SortIndex,
        },
      },
      data: {
        sort_index: {
          decrement: 1,
        },
      },
    });

    await this.db.recommendations.delete({where: {id: recommendation.Id}});
  }

  public async findByBookId(bookId: BookId): Promise<string[]> {
    const recommendationIds = await this.db.using_recommendations.findMany({
      where: {book_id: bookId.Id},
      orderBy: {
        id: 'desc',
      },
      take: 9,
    });

    return recommendationIds.map((column) => column.recommendation_id);
  }

  public async removeUsingByBookId(bookId: BookId): Promise<void> {
    await this.db.using_recommendations.deleteMany({
      where: {book_id: bookId.Id},
    });
  }

  public async removeUsingAll(): Promise<void> {
    await this.db.using_recommendations.deleteMany({
      where: {},
    });
  }

  /**
   * 現在登録されている画像のサムネイル名を取得します
   *
   * @return {*}  {string} サムネイル名の配列
   * @memberof RecommendationRepository
   */
  public fetchAllThumbnailName(): string[] {
    const templatePath = `${appRoot.path}/public/thumbnail/*`;

    const files = glob.sync(templatePath);

    const res: string[] = files.map((file) => path.basename(file, '.png'));

    return res;
  }
}
