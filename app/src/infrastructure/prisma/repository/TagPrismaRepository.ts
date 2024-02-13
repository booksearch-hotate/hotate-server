import {PrismaClient} from "@prisma/client";
import Tag from "../../../domain/model/tag/tag";
import {ITagDBRepository} from "../../../domain/repository/db/ITagDBRepository";
import TagId from "../../../domain/model/tag/tagId";
import BookId from "../../../domain/model/book/bookId";

export default class TagPrismaRepository implements ITagDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async create(tag: Tag): Promise<void> {
    await this.db.tags.create({
      data: {
        id: tag.Id.Id,
        name: tag.Name,
      },
    });
  }

  public async findByName(name: string): Promise<Tag | null> {
    const tag = await this.db.tags.findFirst({
      where: {
        name: name,
      },
      include: {
        using_tags: {
          include: {
            books: true,
          },
        },
      },
    });

    if (tag === null) return null;

    return new Tag(new TagId(tag.id), tag.name, tag.created_at, tag.using_tags.map((book) => book.books.id));
  }

  public async isExistCombination(tagId: TagId, bookId: BookId): Promise<boolean> {
    const found = await this.db.using_tags.findFirst({
      where: {
        tag_id: tagId.Id,
        book_id: bookId.Id,
      },
    });

    return found !== null;
  }

  public async saveCombination(tagId: TagId, bookId: BookId): Promise<void> {
    await this.db.using_tags.create({
      data: {
        tag_id: tagId.Id,
        book_id: bookId.Id,
      },
    });
  }

  public async countById(tagId: TagId): Promise<number> {
    const count = await this.db.using_tags.count({
      where: {
        tag_id: tagId.Id,
      },
    });

    return count;
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.db.tags.findMany({
      include: {
        using_tags: {
          include: {
            books: true,
          },
        },
      },
    });

    return tags.map((tag) => new Tag(new TagId(tag.id), tag.name, tag.created_at, tag.using_tags.map((book) => book.books.id)));
  }

  public async findById(id: TagId): Promise<Tag | null> {
    const tag = await this.db.tags.findFirst({
      where: {
        id: id.Id,
      },
      include: {
        using_tags: {
          include: {
            books: true,
          },
        },
      },
    });

    if (tag === null) return null;

    return new Tag(new TagId(tag.id), tag.name, tag.created_at, tag.using_tags.map((book) => book.books.id));
  }

  public async update(tag: Tag): Promise<void> {
    await this.db.tags.update({
      where: {
        id: tag.Id.Id,
      },
      data: {
        name: tag.Name,
      },
    });
  }

  public async delete(tag: Tag): Promise<void> {
    await this.db.tags.delete({
      where: {
        id: tag.Id.Id,
      },
    });
  }
}
