import Book from '../../infrastructure/db/tables/book';
import Tag from '../../infrastructure/db/tables/tag';
import UsingTag from '../../infrastructure/db/tables/usingTag';

import {ITagApplicationServiceRepository} from '../../application/repository/ITagApplicationServiceRepository';

import TagModel from '../../domain/model/tagModel';

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Tag: typeof Tag,
  UsingTag: typeof UsingTag,
}

export default class TagRepository implements ITagApplicationServiceRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findByName(name: string | null): Promise<TagModel | null> {
    const tag = await this.db.Tag.findOne({
      where: {name},
    });
    if (tag) return new TagModel(tag.id, tag.name, tag.created_at);
    return null;
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
      order: [['created_at', 'DESC']],
    });
    return tags.map((tag) => new TagModel(tag.id, tag.name, tag.created_at));
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
    if (tag) return new TagModel(tag.id, tag.name, tag.created_at);
    return null;
  }

  public async update(id: string, name: string): Promise<void> {
    await this.db.Tag.update({name}, {where: {id}});
  }
}
