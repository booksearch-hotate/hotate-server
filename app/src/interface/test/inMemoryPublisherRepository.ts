import {Db} from 'mongodb';
import {IPublisherRepository} from '../../domain/model/publisher/IPublisherRepository';
import Publisher from '../../domain/model/publisher/publisher';
import {bookCollectionName, bookDocument} from '../../infrastructure/inMemory/collections/book';
import {publisherCollectionName, publisherDocument} from '../../infrastructure/inMemory/collections/publisher';
import {InMemoryDBError} from '../../presentation/error/infrastructure/inMemoryDBError';

export default class InMemoryPublisherRepository implements IPublisherRepository {
  db: Db;
  publisherCollection;
  bookCollection;
  bulkList: publisherDocument[] = []; // bulk apiで実行されると仮定し保存される配列

  constructor(db: Db) {
    this.db = db;
    this.publisherCollection = db.collection<publisherDocument>(publisherCollectionName);
    this.bookCollection = db.collection<bookDocument>(bookCollectionName);
  }

  async save(publisher: Publisher, isBulk: boolean): Promise<void> {
    const insertDoc: publisherDocument = {id: publisher.Id, name: publisher.Name};

    if (isBulk) this.bulkList.push(insertDoc);
    else await this.publisherCollection.insertOne(insertDoc);
  }

  async findByName(name: string | null): Promise<Publisher | null> {
    const res = await this.publisherCollection.findOne({name: {$eq: name}});

    if (res === null) return null;

    return new Publisher(res.id, res.name);
  }

  async deleteAll(): Promise<void> {
    await this.publisherCollection.deleteMany({});
  }

  async executeBulkApi(): Promise<void> {
    await this.publisherCollection.insertMany(this.bulkList);

    this.bulkList = [];
  }

  async findById(publisherId: string): Promise<Publisher> {
    const res = await this.publisherCollection.findOne({id: publisherId});

    if (res) return new Publisher(res.id, res.name);

    throw new InMemoryDBError('Publisher not found');
  }

  async deleteNoUsed(publisherId: string): Promise<void> {
    const havingCount = await this.bookCollection.count({publisher_id: publisherId});

    if (havingCount === 0) this.publisherCollection.deleteOne({id: publisherId});
  }

  async update(publisher: Publisher): Promise<void> {
    const updateDoc: publisherDocument = {name: publisher.Name, id: publisher.Id};

    await this.publisherCollection.updateOne({id: publisher.Id}, updateDoc);
  }

  /** 疑似的にlike検索を使用 */
  async search(name: string): Promise<Publisher[]> {
    const fetchData = this.publisherCollection.find({name: {$regex: name}});

    const publishers: Publisher[] = [];

    await fetchData.forEach((data) => {
      const publisher = new Publisher(data.id, data.name);
      publishers.push(publisher);
    });

    return publishers;
  }

  /** 疑似的に完全一致検索を使用 */
  async searchUsingLike(name: string): Promise<Publisher[]> {
    const fetchData = this.publisherCollection.find({name: {$eq: name}});

    const publishers: Publisher[] = [];

    await fetchData.forEach((data) => {
      const publisher = new Publisher(data.id, data.name);
      publishers.push(publisher);
    });

    return publishers;
  }
}
