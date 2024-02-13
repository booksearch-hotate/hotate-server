import {PrismaClient} from "@prisma/client";
import Book from "../../../domain/model/book/book";
import User from "../../../domain/model/user/user";
import {IBookmarkDBRepository} from "../../../domain/repository/db/IBookmarkDBRepository";
import Author from "../../../domain/model/author/author";
import AuthorId from "../../../domain/model/author/authorId";
import Publisher from "../../../domain/model/publisher/publisher";
import PublisherId from "../../../domain/model/publisher/publisherId";
import BookId from "../../../domain/model/book/bookId";
import Tag from "../../../domain/model/tag/tag";
import TagId from "../../../domain/model/tag/tagId";

export default class BookmarkPrismaRepository implements IBookmarkDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findByUser(user: User): Promise<Book[]> {
    const bookmarks = await this.db.bookmarks.findMany(
        {
          where: {
            user_id: user.Id,
          },
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
    );

    return bookmarks.map((bookmark) => {
      const author = new Author(new AuthorId(bookmark.books.authors.id), bookmark.books.authors.name);
      const publisher = new Publisher(new PublisherId(bookmark.books.publishers.id), bookmark.books.publishers.name);

      return new Book(
          new BookId(bookmark.books.id),
          bookmark.books.book_name,
          bookmark.books.book_sub_name,
          bookmark.books.book_content,
          bookmark.books.isbn,
          bookmark.books.ndc,
          bookmark.books.year,
          author,
          publisher,
          bookmark.books.using_tags.map((usingTag) => new Tag(new TagId(usingTag.tags.id), usingTag.tags.name, usingTag.tags.created_at, [])),
      );
    });
  }

  public async add(user: User, book: Book): Promise<void> {
    await this.db.bookmarks.create({
      data: {
        user_id: user.Id,
        book_id: book.Id.Id,
      },
    });
  }

  public async remove(user: User, book: Book): Promise<void> {
    await this.db.bookmarks.deleteMany({
      where: {
        user_id: user.Id,
        book_id: book.Id.Id,
      },
    });
  }
}
