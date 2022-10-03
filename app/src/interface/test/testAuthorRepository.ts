import {Db} from 'mongodb';
import Author from '../../domain/model/author/author';
import {IAuthorRepository} from '../../domain/model/author/IAuthorRepository';
import {authorCollectionName, authorDocument} from '../../infrastructure/inMemory/collections/author';
import {bookCollectionName, bookDocument} from '../../infrastructure/inMemory/collections/book';
import {InMemoryDBError} from '../../presentation/error/infrastructure';

export default class TestAuthorRepository implements IAuthorRepository {
  db: Db;
  authorCollection;
  bookCollection;
  bulkList: authorDocument[] = []; // bulk apiで実行されると仮定し保存される配列

  constructor(db: Db) {
    this.db = db;
    this.authorCollection = db.collection<authorDocument>(authorCollectionName);
    this.bookCollection = db.collection<bookDocument>(bookCollectionName);
  }

  async save(author: Author, isBulk: boolean): Promise<void> {
    const insertDoc: authorDocument = {id: author.Id, name: author.Name};

    if (isBulk) this.bulkList.push(insertDoc);
    else await this.authorCollection.insertOne(insertDoc);
  }

  async findByName(name: string | null): Promise<Author | null> {
    const res = await this.authorCollection.findOne({name});

    if (res === null) return null;

    return new Author(res.id, res.name);
  }

  async deleteAll(): Promise<void> {
    await this.authorCollection.deleteMany({});
  }

  async executeBulkApi(): Promise<void> {
    await this.authorCollection.insertMany(this.bulkList);

    this.bulkList = [];
  }

  async findById(authorId: string): Promise<Author> {
    const res = await this.authorCollection.findOne({id: authorId});

    if (res) return new Author(res.id, res.name);

    throw new InMemoryDBError('Author not found');
  }

  async deleteNoUsed(authorId: string): Promise<void> {
    const havingCount = await this.bookCollection.count({author_id: authorId});

    if (havingCount === 0) this.authorCollection.deleteOne({id: authorId});
  }

  async update(author: Author): Promise<void> {
    const updateDoc: authorDocument = {name: author.Name, id: author.Id};

    await this.authorCollection.updateOne({id: author.Id}, updateDoc);
  }

  /** 疑似的にlike検索を使用 */
  async search(name: string): Promise<Author[]> {
    const fetchData = this.authorCollection.find({name: {$regex: name}});

    const authors: Author[] = [];

    await fetchData.forEach((data) => {
      const author = new Author(data.id, data.name);
      authors.push(author);
    });

    return authors;
  }

  /** 疑似的に完全一致検索を使用 */
  async searchUsingLike(name: string): Promise<Author[]> {
    const fetchData = this.authorCollection.find({name});

    const authors: Author[] = [];

    await fetchData.forEach((data) => {
      const author = new Author(data.id, data.name);
      authors.push(author);
    });

    return authors;
  }
}
