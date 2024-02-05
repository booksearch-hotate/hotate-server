import {IBookRequestRepository} from '../../domain/repository/IBookRequestRepository';
import BookRequest from '../../domain/model/bookRequest/bookRequest';

import Department from '../../domain/model/department/department';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import {PrismaClient} from '@prisma/client';

export default class RequestRepository implements IBookRequestRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findByDepartmendId(departmentId: string): Promise<BookRequest[]> {
    const fetchData = await this.db.requests.findMany({
      where: {
        department_id: departmentId,
      },
    });

    if (fetchData === null) return [];

    const fetchDepartment = await this.db.departments.findFirst({where: {id: departmentId}});

    if (fetchDepartment === null) throw new MySQLDBError('Could not find department data.');

    return fetchData.map((column) => new BookRequest(
        column.id,
        column.book_name,
        column.author_name,
        column.publisher_name,
        column.isbn,
        column.message,
        new Department(column.department_id, fetchDepartment.name),
        column.school_year,
        column.school_class,
        column.user_name,
        column.created_at,
    ));
  }

  public async register(request: BookRequest): Promise<void> {
    await this.db.requests.create({
      data: {
        id: request.Id,
        book_name: request.BookName,
        author_name: request.AuthorName,
        publisher_name: request.PublisherName,
        isbn: request.Isbn,
        message: request.Message,
        department_id: request.Department.Id,
        school_year: request.SchoolYear,
        school_class: request.SchoolClass,
        user_name: request.UserName,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.db.requests.delete({where: {id: id}});
  }

  public async findAll(): Promise<BookRequest[] | null> {
    const fetchData = await this.db.requests.findMany({orderBy: {created_at: 'desc'}});
    if (fetchData === null) return null;

    const res = [];

    for (const item of fetchData) {
      try {
        const fetchDepartmentData = await this.db.departments.findFirst({where: {id: item.department_id}});

        if (fetchDepartmentData === null) continue;

        const departmentModel = new Department(
            fetchDepartmentData.id,
            fetchDepartmentData.name,
        );

        res.push(new BookRequest(
            item.id,
            item.book_name,
            item.author_name,
            item.publisher_name,
            item.isbn,
            item.message,
            departmentModel,
            item.school_year,
            item.school_class,
            item.user_name,
            item.created_at,
        ));
      } catch (e: any) {
        continue;
      }
    }

    return res;
  }

  public async findById(requestId: string): Promise<BookRequest | null> {
    const fetchData = await this.db.requests.findFirst({where: {id: requestId}});

    if (fetchData === null) return null;

    const fetchDepartmentData = await this.db.departments.findFirst({where: {id: fetchData.department_id}});

    if (fetchDepartmentData === null) throw new MySQLDBError(`Request data existed, but departmental data did not.  requestId: ${fetchData.id}`);

    const departmentModel = new Department(
        fetchDepartmentData.id,
        fetchDepartmentData.name,
    );

    return new BookRequest(
        fetchData.id,
        fetchData.book_name,
        fetchData.author_name,
        fetchData.publisher_name,
        fetchData.isbn,
        fetchData.message,
        departmentModel,
        fetchData.school_year,
        fetchData.school_class,
        fetchData.user_name,
        fetchData.created_at,
    );
  }
}
