import BookTable from '../../infrastructure/db/tables/books';
import TagTable from '../../infrastructure/db/tables/tags';
import UsingTagTable from '../../infrastructure/db/tables/usingTags';

import {ITagRepository} from '../../domain/model/tag/ITagRepository';

import Tag from '../../domain/model/tag/tag';
import sequelize from 'sequelize';
import BookId from '../../domain/model/book/bookId';
import {MySQLDBError} from '../../presentation/error/infrastructure';

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof BookTable,
  Tag: typeof TagTable,
  UsingTag: typeof UsingTagTable,
}

export default class TagRepository implements ITagRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findByName(name: string | null): Promise<Tag | null> {
    const tag = await this.db.Tag.findOne({
      where: {name},
    });

    if (tag === null) return null;

    const fetchHavingBooks = await this.db.UsingTag.findAll({where: {tag_id: tag.id}});

    const bookIds = fetchHavingBooks === null ? [] : fetchHavingBooks.map((column) => column.book_id);

    return new Tag(tag.id, tag.name, tag.created_at, bookIds);
  }

  public async createTag(tagModel: Tag): Promise<void> {
    await this.db.Tag.create({
      id: tagModel.Id,
      name: tagModel.Name,
    });
  }

  public async saveCombination(tagModel: Tag, bookId: string): Promise<void> {
    await this.db.UsingTag.create({
      tag_id: tagModel.Id,
      book_id: bookId,
    });
  }

  public async isExistCombination(tagId: string, bookId: string): Promise<boolean> {
    const usingTag = await this.db.UsingTag.findOne({
      where: {tag_id: tagId, book_id: bookId},
    });
    if (usingTag) return true;
    return false;
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.db.Tag.findAll({
      attributes: [
        'id',
        'name',
        'created_at',
      ],
      order: [['created_at', 'DESC']],
      include: [{
        model: this.db.UsingTag,
        required: true,
        attributes: [],
      }],
    });

    if (tags === null) return [];

    // それぞれのタグが保有している本のidを取得
    // 並列処理で取得
    const promiseTags = tags.map(async (tag) => {
      const fetchBookIds = await this.db.UsingTag.findAll({
        where: {tag_id: tag.id},
      });

      const bookIds = fetchBookIds === null ? [] : fetchBookIds.map((column) => column.book_id);

      return new Tag(tag.id, tag.name, tag.created_at, bookIds);
    });

    return await Promise.all(promiseTags);
  }

  public async delete(tag: Tag): Promise<void> {
    await this.db.UsingTag.destroy({where: {tag_id: tag.Id}});
    await this.db.Tag.destroy({where: {id: tag.Id}});
  }

  public async isExistTable(): Promise<boolean> {
    const usingTags = await this.db.UsingTag.findAll();

    if (usingTags.length > 0) return true;
    return false;
  }

  public async deleteAll(): Promise<void> {
    await this.db.UsingTag.destroy({where: {}});
    await this.db.Tag.destroy({where: {}});
  }

  public async findById(id: string): Promise<Tag | null> {
    const tag = await this.db.Tag.findOne({
      where: {id},
    });

    if (tag === null) return null;

    const fetchBookIds = await this.db.UsingTag.findAll({where: {tag_id: tag.id}});

    return new Tag(tag.id, tag.name, tag.created_at, fetchBookIds.map((column) => column.book_id));
  }

  public async update(tag: Tag): Promise<void> {
    await this.db.Tag.update({name: tag.Name}, {where: {id: tag.Id}});
  }

  public async getCount(tagId: string): Promise<number> {
    const count = await this.db.UsingTag.count({
      where: {tag_id: tagId},
    });
    return count;
  }

  public async findByBookId(bookId: BookId): Promise<Tag[]> {
    const tags = await this.db.UsingTag.findAll({where: {book_id: bookId.Id}});
    const tagModels: Tag[] = [];
    for (const tag of tags) {
      const tagByDb = await this.db.Tag.findOne({where: {id: tag.tag_id}});

      if (!tagByDb) throw new MySQLDBError('tag not found');

      const tagModel = new Tag(tagByDb.id, tagByDb.name, tagByDb.created_at, []);
      tagModels.push(tagModel);
    }
    return tagModels;
  }
}
