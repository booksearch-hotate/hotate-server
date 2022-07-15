import Book from '../../infrastructure/db/tables/books';
import Tag from '../../infrastructure/db/tables/tags';
import UsingTag from '../../infrastructure/db/tables/usingTags';

import {ITagRepository} from '../../domain/model/tag/ITagRepository';

import TagModel from '../../domain/model/tag/tagModel';
import sequelize from 'sequelize';

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Tag: typeof Tag,
  UsingTag: typeof UsingTag,
}

export default class TagRepository implements ITagRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findByName(name: string | null): Promise<TagModel | null> {
    const tag = await this.db.Tag.findOne({
      where: {name},
    });

    if (tag === null) return null;

    const fetchHavingBooks = await this.db.UsingTag.findAll({where: {tag_id: tag.id}});

    const bookIds = fetchHavingBooks === null ? [] : fetchHavingBooks.map((column) => column.book_id);

    return new TagModel(tag.id, tag.name, tag.created_at, bookIds);
  }

  public async createTag(tagModel: TagModel): Promise<void> {
    await this.db.Tag.create({
      id: tagModel.Id,
      name: tagModel.Name,
    });
  }

  public async saveCombination(tagModel: TagModel, bookId: string): Promise<void> {
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

  public async findAll(): Promise<TagModel[]> {
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

    const promiseTags = tags.map(async (tag) => {
      const fetchBookIds = await this.db.UsingTag.findAll({
        where: {tag_id: tag.id},
      });

      const bookIds = fetchBookIds === null ? [] : fetchBookIds.map((column) => column.book_id);

      return new TagModel(tag.id, tag.name, tag.created_at, bookIds);
    });

    return await Promise.all(promiseTags);
  }

  public async delete(id: string): Promise<void> {
    await this.db.UsingTag.destroy({where: {tag_id: id}});
    await this.db.Tag.destroy({where: {id}});
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

  public async findById(id: string): Promise<TagModel | null> {
    const tag = await this.db.Tag.findOne({
      where: {id},
    });
    if (tag) return new TagModel(tag.id, tag.name, tag.created_at, []);
    return null;
  }

  public async update(id: string, name: string): Promise<void> {
    await this.db.Tag.update({name}, {where: {id}});
  }

  public async getCount(tagId: string): Promise<number> {
    const count = await this.db.UsingTag.count({
      where: {tag_id: tagId},
    });
    return count;
  }
}
