import {Db} from 'mongodb';
import BookRequest from '../../domain/model/bookRequest/bookRequest';
import bookRequest from '../../domain/model/bookRequest/bookRequest';
import {IBookRequestRepository} from '../../domain/model/bookRequest/IBookRequestRepository';
import {requests} from '../../infrastructure/inMemory/collections/bookRequest';

const collectionName = 'requests';

export default class TestRequestRepository implements IBookRequestRepository {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async findByDepartmendId(departmentId: string): Promise<BookRequest[]> {
    const col = this.db.collection<requests>(collectionName);
    const data = col.find({'department.Id': departmentId});

    const list:BookRequest[] = [];

    await data.forEach((data) => {
      const res = new BookRequest(
          data.id,
          data.bookName,
          data.authorName,
          data.publisherName,
          data.isbn,
          data.message,
          data.department,
          data.schoolYear,
          data.schoolClass,
          data.userName,
          data.createdAt,
      );

      list.push(res);
    });

    return list;
  }


  async register(request: bookRequest): Promise<void> {
    const col = this.db.collection(collectionName);
    await col.insertOne(request);
  }

  async findById(requestId: string): Promise<bookRequest | null> {
    const col = this.db.collection<requests>(collectionName);
    const data = await col.findOne({id: requestId});

    if (data === null) return null;

    const res = new BookRequest(
        requestId,
        data.bookName,
        data.authorName,
        data.publisherName,
        data.isbn,
        data.message,
        data.department,
        data.schoolYear,
        data.schoolClass,
        data.userName,
        data.createdAt,
    );

    return res;
  }

  async findAll(): Promise<BookRequest[] | null> {
    const col = this.db.collection<requests>(collectionName);
    const data = col.find();

    const list:BookRequest[] = [];

    await data.forEach((data) => {
      const res = new BookRequest(
          data.id,
          data.bookName,
          data.authorName,
          data.publisherName,
          data.isbn,
          data.message,
          data.department,
          data.schoolYear,
          data.schoolClass,
          data.userName,
          data.createdAt,
      );

      list.push(res);
    });

    return list;
  }

  async delete(id: string): Promise<void> {
    const col = this.db.collection<requests>(collectionName);

    await col.deleteOne({id});
  }
}
