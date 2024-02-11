import {PrismaClient} from "@prisma/client";
import {IBookDBRepository} from "../../../domain/repository/db/IBookDBRepository";
import Book from "../../../domain/model/book/book";
import BookId from "../../../domain/model/book/bookId";
import Recommendation from "../../../domain/model/recommendation/recommendation";
import Publisher from "../../../domain/model/publisher/publisher";
import Author from "../../../domain/model/author/author";
import PublisherId from "../../../domain/model/publisher/publisherId";
import AuthorId from "../../../domain/model/author/authorId";
import Tag from "../../../domain/model/tag/tag";
import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import TagId from "../../../domain/model/tag/tagId";
import RecommendationId from "../../../domain/model/recommendation/recommendationId";

export default class BookPrismaRepository implements IBookDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findById(id: BookId): Promise<{ book: Book; recommendations: Recommendation[]; } | null> {
    const book = await this.db.books.findFirst({
      where: {
        id: id.Id,
      },
      include: {
        using_recommendations: {
          include: {
            recommendations: true,
          },
        },
        using_tags: {
          include: {
            tags: true,
          },
        },
        authors: true,
        publishers: true,
      },
    });

    if (book === null) return null;

    return {
      book: new Book(
          new BookId(book.id),
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(
              new AuthorId(book.authors.id),
              book.authors.name,
          ),
          new Publisher(
              new PublisherId(book.publishers.id),
              book.publishers.name,
          ),
          book.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      ),
      recommendations: book.using_recommendations.map((recommendation) => new Recommendation(
          new RecommendationId(recommendation.recommendations.id),
          recommendation.recommendations.title,
          recommendation.recommendations.content,
          recommendation.recommendations.is_solid === 1,
          recommendation.recommendations.sort_index,
          recommendation.recommendations.thumbnail_name,
          recommendation.recommendations.created_at,
          recommendation.recommendations.updated_at,
          [],
      )),
    };
  }

  public async searchByTag(tagName: string, pageCount: number, margin: PaginationMargin): Promise<{ books: Book[]; count: number; }> {
    const FETCH_COUNT = margin.Margin;

    const tag = await this.db.tags.findFirst({
      where: {name: tagName},
    });

    if (!tag) return {books: [], count: 0};

    const tagIds = await this.db.using_tags.findMany({
      where: {tag_id: tag.id},
      take: FETCH_COUNT,
      skip: pageCount * FETCH_COUNT,
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
    });

    const count = await this.db.using_tags.count({where: {tag_id: tag.id}});

    const books = tagIds.map((column) => {
      return new Book(
          new BookId(column.books.id),
          column.books.book_name,
          column.books.book_sub_name,
          column.books.book_content,
          column.books.isbn,
          column.books.ndc,
          column.books.year,
          new Author(
              new AuthorId(column.books.authors.id),
              column.books.authors.name,
          ),
          new Publisher(
              new PublisherId(column.books.publishers.id),
              column.books.publishers.name,
          ),
          column.books.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      );
    });

    return {books, count};
  }

  public async findByIds(ids: BookId[]): Promise<Book[]> {
    const books = await this.db.books.findMany({
      where: {
        id: {
          in: ids.map((id) => id.Id),
        },
      },
      include: {
        using_tags: {
          include: {
            tags: true,
          },
        },
        authors: true,
        publishers: true,
      },
    });

    return books.map((book) => {
      return new Book(
          new BookId(book.id),
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(
              new AuthorId(book.authors.id),
              book.authors.name,
          ),
          new Publisher(
              new PublisherId(book.publishers.id),
              book.publishers.name,
          ),
          book.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      );
    });
  }

  public async findByAuthorIds(ids: AuthorId[]): Promise<Book[]> {
    const books = await this.db.books.findMany({
      where: {
        author_id: {
          in: ids.map((id) => id.Id),
        },
      },
      include: {
        using_tags: {
          include: {
            tags: true,
          },
        },
        authors: true,
        publishers: true,
      },
    });

    return books.map((book) => {
      return new Book(
          new BookId(book.id),
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(
              new AuthorId(book.authors.id),
              book.authors.name,
          ),
          new Publisher(
              new PublisherId(book.publishers.id),
              book.publishers.name,
          ),
          book.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      );
    });
  }

  public async findByPublisherIds(ids: PublisherId[]): Promise<Book[]> {
    const books = await this.db.books.findMany({
      where: {
        publisher_id: {
          in: ids.map((id) => id.Id),
        },
      },
      include: {
        using_tags: {
          include: {
            tags: true,
          },
        },
        authors: true,
        publishers: true,
      },
    });

    return books.map((book) => {
      return new Book(
          new BookId(book.id),
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(
              new AuthorId(book.authors.id),
              book.authors.name,
          ),
          new Publisher(
              new PublisherId(book.publishers.id),
              book.publishers.name,
          ),
          book.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      );
    });
  }

  public async findAll(pageCount: number, margin: PaginationMargin): Promise<Book[]> {
    const FETCH_DATA_NUM = margin.Margin;

    const books = await this.db.books.findMany({
      take: FETCH_DATA_NUM,
      skip: pageCount * FETCH_DATA_NUM,
      orderBy: {updatedAt: "desc"},
      include: {
        using_tags: {
          include: {
            tags: true,
          },
        },
        authors: true,
        publishers: true,
      },
    });

    return books.map((book) => {
      return new Book(
          new BookId(book.id),
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(
              new AuthorId(book.authors.id),
              book.authors.name,
          ),
          new Publisher(
              new PublisherId(book.publishers.id),
              book.publishers.name,
          ),
          book.using_tags.map((tag) => new Tag(
              new TagId(tag.tags.id),
              tag.tags.name,
              tag.tags.created_at,
              [],
          )),
      );
    });
  }

  public async countAll(): Promise<number> {
    return await this.db.books.count();
  }

  public async update(book: Book): Promise<void> {
    await this.db.books.update({
      where: {id: book.Id.Id},
      data: {
        book_name: book.Name,
        book_sub_name: book.SubName,
        book_content: book.Content,
        isbn: book.Isbn,
        ndc: book.Ndc,
        year: book.Year,
        author_id: book.Author.Id.Id,
        publisher_id: book.Publisher.Id.Id,
      },
    });
  }

  public async save(book: Book): Promise<void> {
    await this.db.books.create({
      data: {
        id: book.Id.Id,
        book_name: book.Name,
        book_sub_name: book.SubName,
        book_content: book.Content,
        isbn: book.Isbn,
        ndc: book.Ndc,
        year: book.Year,
        author_id: book.Author.Id.Id,
        publisher_id: book.Publisher.Id.Id,
      },
    });

    await Promise.all(book.Tags.map((tag) => {
      return this.db.using_tags.create({
        data: {
          tag_id: tag.Id.Id,
          book_id: book.Id.Id,
        },
      });
    }));
  }

  public async delete(book: Book): Promise<void> {
    await this.db.books.delete({
      where: {id: book.Id.Id},
    });
  }

  public async deleteAll(): Promise<void> {
    await this.db.books.deleteMany({});
  }

  public async saveMany(books: Book[]): Promise<void> {
    await this.db.$transaction(async (prisma) => {
      await this.db.books.createMany({
        data: books.map((book) => {
          return {
            id: book.Id.Id,
            book_name: book.Name,
            book_sub_name: book.SubName,
            book_content: book.Content,
            isbn: book.Isbn,
            ndc: book.Ndc,
            year: book.Year,
            author_id: book.Author.Id.Id,
            publisher_id: book.Publisher.Id.Id,
          };
        }),
      });
    });
  }

  public async findDuplicateBookNames(): Promise<string[]> {
    const books = await this.db.books.groupBy({
      by: ["book_name"],
      _count: {
        _all: true,
      },
      having: {
        book_name: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    return books.map((book) => book.book_name);
  }
}
