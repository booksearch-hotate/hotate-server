import {ITagRepository} from '../../domain/repository/ITagRepository';

import Tag from '../../domain/model/tag/tag';
import BookId from '../../domain/model/book/bookId';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import {PrismaClient} from '@prisma/client';


export default class TagRepository implements ITagRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findByName(name: string | null): Promise<Tag | null> {
    if (name === null) return null;
    const tag = await this.db.tags.findFirst({
      where: {name},
      include: {
        using_tags: true,
      },
    });

    if (tag === null) return null;

    const bookIds = tag.using_tags.map((column) => column.book_id);

    return new Tag(tag.id, tag.name, tag.created_at, bookIds);
  }

  public async createTag(tagModel: Tag): Promise<void> {
    await this.db.tags.create({
      data: {
        id: tagModel.Id,
        name: tagModel.Name,
      },
    });
  }

  public async saveCombination(tagModel: Tag, bookId: string): Promise<void> {
    await this.db.using_tags.create({
      data: {
        tag_id: tagModel.Id,
        book_id: bookId,
      },
    });
  }

  public async isExistCombination(tagId: string, bookId: string): Promise<boolean> {
    const usingTag = await this.db.using_tags.findFirst({
      where: {tag_id: tagId, book_id: bookId},
    });
    if (usingTag) return true;
    return false;
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.db.tags.findMany({
      orderBy: {created_at: 'desc'},
      include: {
        using_tags: true,
      },
    });

    if (tags === null) return [];

    // それぞれのタグが保有している本のidを取得
    // 並列処理で取得
    const promiseTags = tags.map(async (tag) => {
      const fetchBookIds = await this.db.using_tags.findMany({
        where: {tag_id: tag.id},
      });

      const bookIds = fetchBookIds === null ? [] : fetchBookIds.map((column) => column.book_id);

      return new Tag(tag.id, tag.name, tag.created_at, bookIds);
    });

    return await Promise.all(promiseTags);
  }

  public async delete(tag: Tag): Promise<void> {
    await this.db.using_tags.deleteMany({where: {tag_id: tag.Id}});
    await this.db.tags.delete({where: {id: tag.Id}});
  }

  public async isExistTable(): Promise<boolean> {
    const usingTags = await this.db.using_tags.findMany();

    if (usingTags.length > 0) return true;
    return false;
  }

  public async deleteAll(): Promise<void> {
    await this.db.using_tags.deleteMany({where: {}});
    await this.db.tags.deleteMany({where: {}});
  }

  public async findById(id: string): Promise<Tag | null> {
    const tag = await this.db.tags.findFirst({
      where: {id},
    });

    if (tag === null) return null;

    const fetchBookIds = await this.db.using_tags.findMany({where: {tag_id: tag.id}});

    return new Tag(tag.id, tag.name, tag.created_at, fetchBookIds.map((column) => column.book_id));
  }

  public async update(tag: Tag): Promise<void> {
    await this.db.tags.update({
      where: {
        id: tag.Id,
      },
      data: {
        name: tag.Name,
      },
    });
  }

  public async getCount(tagId: string): Promise<number> {
    const count = await this.db.using_tags.count({
      where: {tag_id: tagId},
    });
    return count;
  }

  public async findByBookId(bookId: BookId): Promise<Tag[]> {
    const tags = await this.db.using_tags.findMany({where: {book_id: bookId.Id}});
    const tagModels: Tag[] = [];
    for (const tag of tags) {
      const tagByDb = await this.db.tags.findFirst({where: {id: tag.tag_id}});

      if (!tagByDb) throw new MySQLDBError('tag not found');

      const tagModel = new Tag(tagByDb.id, tagByDb.name, tagByDb.created_at, []);
      tagModels.push(tagModel);
    }
    return tagModels;
  }
}
