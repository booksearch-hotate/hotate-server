import {IBookRequestRepository} from '../../domain/model/bookRequest/IBookRequestRepository';
import BookRequestModel from '../../domain/model/bookRequest/bookRequestModel';

import RequestTable from '../../infrastructure/db/tables/requests';
import DepartmentTable from '../../infrastructure/db/tables/departments';
import DepartmentModel from '../../domain/model/department/departmentModel';

interface sequelize {
  Request: typeof RequestTable,
  Department: typeof DepartmentTable,
}

export default class RequestRepository implements IBookRequestRepository {
  private db: sequelize;

  constructor(db: sequelize) {
    this.db = db;
  }

  public async register(request: BookRequestModel): Promise<void> {
    await this.db.Request.create({
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
    });
  }

  public async delete(id: string): Promise<void> {
    await this.db.Request.destroy({where: {id: id}});
  }

  public async findAll(): Promise<BookRequestModel[] | null> {
    const fetchData = await this.db.Request.findAll({order: [['created_at', 'DESC']]});
    if (fetchData === null) return null;

    const res = [];

    for (const item of fetchData) {
      try {
        const fetchDepartmentData = await this.db.Department.findOne({where: {id: item.department_id}});

        if (fetchDepartmentData === null) continue;

        const departmentModel = new DepartmentModel(
            fetchDepartmentData.id,
            fetchDepartmentData.name,
        );

        res.push(new BookRequestModel(
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

  public async findById(requestId: string): Promise<BookRequestModel | null> {
    const fetchData = await this.db.Request.findOne({where: {id: requestId}});

    if (fetchData === null) return null;

    const fetchDepartmentData = await this.db.Department.findOne({where: {id: fetchData.department_id}});

    if (fetchDepartmentData === null) throw new Error(`Request data existed, but departmental data did not.  requestId: ${fetchData.id}`);

    const departmentModel = new DepartmentModel(
        fetchDepartmentData.id,
        fetchDepartmentData.name,
    );

    return new BookRequestModel(
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
