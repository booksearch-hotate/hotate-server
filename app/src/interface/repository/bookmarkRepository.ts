import {PrismaClient} from '@prisma/client';
import Book from '../../domain/model/book/book';
import {IBookmarkRepository} from '../../domain/model/bookmark/IBookmarkRepository';
import User from '../../domain/model/user/user';
import Logger from '../../infrastructure/logger/logger';
import Publisher from '../../domain/model/publisher/publisher';
import Author from '../../domain/model/author/author';
import Tag from '../../domain/model/tag/tag';

const logger = new Logger('bookmarkRepository');

export default class BookmarkRepository implements IBookmarkRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async save(user: User, book: Book): Promise<void> {
    if (await this.isAlreadyBookmarked(user, book)) {
      logger.warn(`User ${user.Id} already bookmarked book ${book.Id}`);
      return;
    }
    await this.db.bookmarks.create({
      data: {
        user_id: user.Id,
        book_id: book.Id,
      },
    });
  }

  public async isAlreadyBookmarked(user: User, book: Book): Promise<boolean> {
    const data = await this.db.bookmarks.findFirst({
      where: {
        user_id: user.Id,
        book_id: book.Id,
      },
    });

    return data !== null;
  }

  public async getBookmarksByUserId(userId: number): Promise<Book[]> {
    const data = await this.db.bookmarks.findMany({
      where: {
        user_id: userId,
      },
      include: {
        books: {
          include: {
            using_tags: {
              include: {
                tags: true,
              },
            },
            authors: true,
            publishers: true,
          },
        },
      },
    });

    return data.map((bookmark) => {
      const book = bookmark.books;
      const tags = book.using_tags.map((usingTag) => usingTag.tags);
      return new Book(
          book.id,
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          new Author(book.authors.id, book.authors.name),
          new Publisher(book.publishers.id, book.publishers.name),
          tags.map((tag) => new Tag(tag.id, tag.name, null, [])),
      );
    });
  }

  public async delete(user: User, book: Book): Promise<void> {
    await this.db.bookmarks.deleteMany({
      where: {
        user_id: user.Id,
        book_id: book.Id,
      },
    });
  }
}
