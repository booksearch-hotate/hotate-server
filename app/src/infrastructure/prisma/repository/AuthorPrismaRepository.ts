import {PrismaClient} from "@prisma/client";
import Author from "../../../domain/model/author/author";
import AuthorId from "../../../domain/model/author/authorId";
import {IAuthorDBRepository} from "../../../domain/repository/db/IAuthorDBRepository";

export default class AuthorPrismaRepository implements IAuthorDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findById(authorId: AuthorId): Promise<Author | null> {
    const author = await this.db.authors.findUnique({
      where: {
        id: authorId.Id,
      },
    });

    if (author === null) return null;

    return new Author(new AuthorId(author.id), author.name);
  }

  public async findByName(name: string): Promise<Author | null> {
    const author = await this.db.authors.findFirst({
      where: {
        name: name,
      },
    });

    if (author === null) return null;

    return new Author(new AuthorId(author.id), author.name);
  }

  public async update(author: Author): Promise<void> {
    await this.db.authors.update({
      where: {
        id: author.Id.Id,
      },
      data: {
        name: author.Name,
      },
    });
  }

  public async save(author: Author): Promise<void> {
    await this.db.authors.create({
      data: {
        id: author.Id.Id,
        name: author.Name,
      },
    });
  }

  public async findNotUsed(): Promise<Author[]> {
    const authors = await this.db.authors.findMany({
      where: {
        books: {
          none: {},
        },
      },
    });

    return authors.map((author) => new Author(new AuthorId(author.id), author.name));
  }

  public async deleteAuthors(authorIds: AuthorId[]): Promise<void> {
    await this.db.authors.deleteMany({
      where: {
        id: {
          in: authorIds.map((authorId) => authorId.Id),
        },
      },
    });
  }

  public async delete(authorId: AuthorId): Promise<void> {
    await this.deleteAuthors([authorId]);
  }

  public async saveMany(authors: Author[]): Promise<void> {
    await this.db.authors.createMany({
      data: authors.map((author) => {
        return {
          id: author.Id.Id,
          name: author.Name,
        };
      }),
    });
  }
}
