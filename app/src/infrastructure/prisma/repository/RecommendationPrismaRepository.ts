import {PrismaClient} from "@prisma/client";
import {IRecommendationDBRepository} from "../../../domain/repository/db/IRecommendationDBRepository";
import BookId from "../../../domain/model/book/bookId";
import Recommendation from "../../../domain/model/recommendation/recommendation";
import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import RecommendationItem from "../../../domain/model/recommendation/recommendationItem";
import RecommendationId from "../../../domain/model/recommendation/recommendationId";
import Book from "../../../domain/model/book/book";
import Author from "../../../domain/model/author/author";
import Publisher from "../../../domain/model/publisher/publisher";
import AuthorId from "../../../domain/model/author/authorId";
import PublisherId from "../../../domain/model/publisher/publisherId";
import Tag from "../../../domain/model/tag/tag";
import TagId from "../../../domain/model/tag/tagId";

export default class RecommendationPrismaRepository implements IRecommendationDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findByBookId(bookId: BookId): Promise<Recommendation[]> {
    const fetchModels = await this.db.books.findFirst({
      where: {
        id: bookId.Id,
      },
      include: {
        using_recommendations: {
          include: {
            recommendations: true,
          },
        },
      },
    });

    if (fetchModels === null) return [];

    return fetchModels.using_recommendations.map((usingRecommendation) => {
      const recommendation = usingRecommendation.recommendations;
      return new Recommendation(
          new RecommendationId(recommendation.id),
          recommendation.title,
          recommendation.content,
          recommendation.is_solid ? true : false,
          recommendation.sort_index,
          recommendation.thumbnail_name,
          recommendation.created_at,
          recommendation.updated_at,
          [],
      );
    });
  }

  public async fetch(pageCount: number, count: PaginationMargin): Promise<Recommendation[]> {
    const FETCH_DATA_NUM = count.Margin;
    const fetchModels = await this.db.recommendations.findMany({
      take: FETCH_DATA_NUM,
      skip: FETCH_DATA_NUM * pageCount,
      orderBy: [
        {is_solid: "desc"},
        {sort_index: "desc"},
      ],
      include: {
        using_recommendations: {
          include: {
            books: {
              include: {
                authors: true,
                publishers: true,
                using_tags: {
                  include: {
                    tags: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return fetchModels.map((recommendation) => {
      const items = recommendation.using_recommendations.map((column) => {
        const book = new Book(
            new BookId(column.books.id),
            column.books.book_name,
            column.books.book_sub_name,
            column.books.book_content,
            column.books.isbn,
            column.books.ndc,
            column.books.year,
            new Author(new AuthorId(column.books.authors.id), column.books.authors.name),
            new Publisher(new PublisherId(column.books.publishers.id), column.books.publishers.name),
            column.books.using_tags.map((tag) => new Tag(new TagId(tag.tags.id), tag.tags.name, tag.tags.created_at, [])),
        );

        return new RecommendationItem(book, column.comment);
      });

      return new Recommendation(
          new RecommendationId(recommendation.id),
          recommendation.title,
          recommendation.content,
          recommendation.is_solid ? true : false,
          recommendation.sort_index,
          recommendation.thumbnail_name,
          recommendation.created_at,
          recommendation.updated_at,
          items,
      );
    });
  }

  public async count(): Promise<number> {
    return this.db.recommendations.count();
  }

  public async findById(id: RecommendationId): Promise<Recommendation | null> {
    const fetchModel = await this.db.recommendations.findFirst({
      where: {
        id: id.Id,
      },
      include: {
        using_recommendations: {
          include: {
            books: {
              include: {
                authors: true,
                publishers: true,
                using_tags: {
                  include: {
                    tags: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (fetchModel === null) return null;

    const items = fetchModel.using_recommendations.map((column) => {
      const book = new Book(
          new BookId(column.books.id),
          column.books.book_name,
          column.books.book_sub_name,
          column.books.book_content,
          column.books.isbn,
          column.books.ndc,
          column.books.year,
          new Author(new AuthorId(column.books.authors.id), column.books.authors.name),
          new Publisher(new PublisherId(column.books.publishers.id), column.books.publishers.name),
          column.books.using_tags.map((tag) => new Tag(new TagId(tag.tags.id), tag.tags.name, tag.tags.created_at, [])),
      );

      return new RecommendationItem(book, column.comment);
    });
    return new Recommendation(
        new RecommendationId(fetchModel.id),
        fetchModel.title,
        fetchModel.content,
        fetchModel.is_solid ? true : false,
        fetchModel.sort_index,
        fetchModel.thumbnail_name,
        fetchModel.created_at,
        fetchModel.updated_at,
        items,
    );
  }

  public async fetchMaxIndex(): Promise<number> {
    const fetchModel = await this.db.recommendations.findFirst({
      orderBy: [
        {sort_index: "desc"},
      ],
    });

    if (fetchModel === null) return 0;

    return fetchModel.sort_index;
  }

  public async update(recommendation: Recommendation): Promise<void> {
    if (recommendation.IsSolid) {
      await this.db.recommendations.updateMany({
        where: {
          is_solid: 1,
        },
        data: {
          is_solid: 0,
        },
      });
    }

    await this.db.recommendations.update({
      where: {
        id: recommendation.Id.Id,
      },
      data: {
        title: recommendation.Title,
        content: recommendation.Content,
        is_solid: recommendation.IsSolid ? 1 : 0,
        sort_index: recommendation.SortIndex,
        thumbnail_name: recommendation.ThumbnailName,
      },
    });

    const items = recommendation.RecommendationItems.map((item) => {
      return {
        comment: item.Comment,
        book_id: item.Book.Id,
      };
    });

    const queryItems = items.map((item) => {
      return {
        book_id: item.book_id.Id,
        comment: item.comment,
        recommendation_id: recommendation.Id.Id,
      };
    });

    await this.db.using_recommendations.deleteMany({
      where: {recommendation_id: recommendation.Id.Id}});

    await this.db.using_recommendations.createMany({data: queryItems});
  }

  public async save(recommendation: Recommendation): Promise<void> {
    await this.db.recommendations.create({
      data: {
        id: recommendation.Id.Id,
        title: recommendation.Title,
        content: recommendation.Content,
        is_solid: recommendation.IsSolid ? 1 : 0,
        sort_index: recommendation.SortIndex,
        thumbnail_name: recommendation.ThumbnailName,
        using_recommendations: {
          create: recommendation.RecommendationItems.map((item) => {
            return {
              comment: item.Comment,
              books: {
                connect: {
                  id: item.Book.Id.Id,
                },
              },
            };
          }),
        },
      },
    });
  }

  public async delete(recommendation: Recommendation): Promise<void> {
    await this.db.recommendations.delete({where: {id: recommendation.Id.Id}});
  }
}
