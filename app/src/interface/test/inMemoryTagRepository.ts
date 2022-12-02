import {Db} from 'mongodb';
import bookId from '../../domain/model/book/bookId';
import {ITagRepository} from '../../domain/model/tag/ITagRepository';
import Tag from '../../domain/model/tag/tag';
import {tagCollectionName, tagDocument} from '../../infrastructure/inMemory/collections/tag';
import {usingTagCollectionName, usingTagDocument} from '../../infrastructure/inMemory/collections/usingTag';
import {InMemoryDBError} from '../../presentation/error/infrastructure';

export default class InMemoryTagRepository implements ITagRepository {
  db: Db;
  tagCollection;
  usingTagCollection;

  constructor(db: Db) {
    this.db = db;
    this.tagCollection = db.collection<tagDocument>(tagCollectionName);
    this.usingTagCollection = db.collection<usingTagDocument>(usingTagCollectionName);
  }

  async createTag(tagModel: Tag): Promise<void> {
    await this.tagCollection.insertOne({id: tagModel.Id, name: tagModel.Name, createdAt: new Date()});
  }

  async findByName(name: string): Promise<Tag | null> {
    const res = await this.tagCollection.findOne({name: {$eq: name}});

    if (res === null) return null;

    const bookIds = (await this.usingTagCollection.find({tag_id: res.id}).toArray()) as usingTagDocument[];

    return new Tag(res.id, res.name, res.createdAt, bookIds.map((item) => item.book_id));
  }

  async saveCombination(tagModel: Tag, bookId: string): Promise<void> {
    await this.usingTagCollection.insertOne({tag_id: tagModel.Id, book_id: bookId});
  }

  async isExistCombination(tagId: string, bookId: string): Promise<boolean> {
    const count = await this.usingTagCollection.count({tag_id: {$eq: tagId}, book_id: {$eq: bookId}});

    return count !== 0;
  }

  async findAll(): Promise<Tag[]> {
    const fetchDatas = (await this.tagCollection.find({}).toArray()) as tagDocument[];

    const tags = await Promise.all(fetchDatas.map(async (item) => {
      const bookIds = (await this.usingTagCollection.find({tag_id: item.id}).toArray()) as usingTagDocument[];

      return new Tag(item.id, item.name, item.createdAt, bookIds.map((item) => item.book_id));
    }));

    return tags;
  }

  async delete(tag: Tag): Promise<void> {
    await this.usingTagCollection.deleteMany({tag_id: tag.Id});
    await this.tagCollection.deleteOne({id: tag.Id});
  }

  async isExistTable(): Promise<boolean> {
    const count = await this.usingTagCollection.countDocuments({});

    return count > 0;
  }

  async deleteAll(): Promise<void> {
    await this.usingTagCollection.deleteMany({});
  }

  async findById(id: string): Promise<Tag | null> {
    const res = await this.tagCollection.findOne({id: {$eq: id}});

    if (res === null) return null;

    const bookIds = (await this.usingTagCollection.find({tag_id: res.id}).toArray()) as usingTagDocument[];

    return new Tag(res.id, res.name, res.createdAt, bookIds.map((item) => item.book_id));
  }

  async update(tag: Tag): Promise<void> {
    const fetchTag = await this.tagCollection.findOne({id: tag.Id});
    if (fetchTag === null) throw new InMemoryDBError('tag not found');
    const updateDoc: tagDocument = {name: tag.Name, id: tag.Id, createdAt: fetchTag.createdAt};

    await this.tagCollection.updateOne({id: tag.Id}, updateDoc);
  }

  async getCount(tagId: string): Promise<number> {
    const count = await this.tagCollection.count({id: tagId});

    return count;
  }

  async findByBookId(bookId: bookId): Promise<Tag[]> {
    const usingTagIds = (await this.usingTagCollection.find({book_id: bookId.Id}).toArray()) as usingTagDocument[];

    const tags = await Promise.all(usingTagIds.map(async (item) => {
      const tag = await this.tagCollection.findOne({id: item.tag_id});

      if (tag === null) throw new InMemoryDBError(`Tag not found when find by bookId: ${bookId}`);

      const bookIds = (await this.usingTagCollection.find({tag_id: tag.id}).toArray()) as usingTagDocument[];
      return new Tag(tag.id, tag.name, tag.createdAt, bookIds.map((item) => item.book_id));
    }));

    return tags;
  }
}
