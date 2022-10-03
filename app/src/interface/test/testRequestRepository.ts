import {Db} from 'mongodb';
import BookRequest from '../../domain/model/bookRequest/bookRequest';
import bookRequest from '../../domain/model/bookRequest/bookRequest';
import {IBookRequestRepository} from '../../domain/model/bookRequest/IBookRequestRepository';
import Department from '../../domain/model/department/department';
import {bookRequestCollectionName, requestDocument} from '../../infrastructure/inMemory/collections/bookRequest';

const collectionName = bookRequestCollectionName;

export default class TestRequestRepository implements IBookRequestRepository {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async findByDepartmendId(departmentId: string): Promise<BookRequest[]> {
    const col = this.db.collection<requestDocument>(collectionName);
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
          new Department(data.department.id, data.department.name),
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
    const col = this.db.collection<requestDocument>(collectionName);

    const doc: requestDocument = {
      id: request.Id,
      bookName: request.BookName,
      authorName: request.AuthorName,
      publisherName: request.PublisherName,
      isbn: request.Isbn,
      message: request.Message,
      department: {
        id: request.Department.Id,
        name: request.Department.Name,
      },
      schoolYear: request.SchoolYear,
      schoolClass: request.SchoolClass,
      userName: request.UserName,
      createdAt: request.CreatedAt,
    };

    await col.insertOne(doc);
  }

  async findById(requestId: string): Promise<bookRequest | null> {
    const col = this.db.collection<requestDocument>(collectionName);
    const data = await col.findOne({id: requestId});

    if (data === null) return null;

    const department = new Department(data.department.id, data.department.name);

    const res = new BookRequest(
        requestId,
        data.bookName,
        data.authorName,
        data.publisherName,
        data.isbn,
        data.message,
        department,
        data.schoolYear,
        data.schoolClass,
        data.userName,
        data.createdAt,
    );

    return res;
  }

  async findAll(): Promise<BookRequest[] | null> {
    const col = this.db.collection<requestDocument>(collectionName);
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
          new Department(data.department.id, data.department.name),
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
    const col = this.db.collection<requestDocument>(collectionName);

    await col.deleteOne({id});
  }
}
