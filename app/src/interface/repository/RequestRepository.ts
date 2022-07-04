import {IRequestApplicationRepository} from '../../application/repository/IRequestApplicationRepository';
import requestModel from '../../domain/model/requestModel';

import Request from '../../infrastructure/db/tables/requests';

interface sequelize {
  Request: typeof Request,
}

export default class RequestRepository implements IRequestApplicationRepository {
  private db: sequelize;

  constructor(db: sequelize) {
    this.db = db;
  }

  public async register(request: requestModel): Promise<void> {
    await this.db.Request.create({
      id: request.Id,
      book_name: request.BookName,
      author_name: request.AuthorName,
      publisher_name: request.PublisherName,
      isbn: request.Isbn,
      message: request.Message,
      department_id: request.DepartmentId,
      school_year: request.SchoolYear,
      school_class: request.SchoolClass,
      user_name: request.UserName,
    });
  }
}
