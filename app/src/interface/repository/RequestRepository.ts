import {IRequestApplicationRepository} from '../../application/repository/IRequestApplicationRepository';
import RequestModel from '../../domain/model/requestModel';

import Request from '../../infrastructure/db/tables/requests';
import Department from '../../infrastructure/db/tables/departments';
import DepartmentModel from '../../domain/model/departmentModel';

interface sequelize {
  Request: typeof Request,
  Department: typeof Department,
}

export default class RequestRepository implements IRequestApplicationRepository {
  private db: sequelize;

  constructor(db: sequelize) {
    this.db = db;
  }

  public async register(request: RequestModel): Promise<void> {
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

  public async findAll(): Promise<RequestModel[] | null> {
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

        res.push(new RequestModel(
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
}
