import {IDepartmentRepository} from '../../domain/model/department/IDepartmentRepository';

import Department from '../../domain/model/department/departmentModel';

import DepartmentTable from '../../infrastructure/db/tables/departments';
import RequestTable from '../../infrastructure/db/tables/requests';

import BookRequest from '../../domain/model/bookRequest/bookRequestModel';

interface sequelize {
  Department: typeof DepartmentTable,
  Request: typeof RequestTable,
}

export default class DepartmentRepository implements IDepartmentRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findAllDepartment(): Promise<Department[]> {
    const fetchData = await this.db.Department.findAll({
      order: [['created_at', 'DESC']],
    });

    const res: Department[] = [];

    /* ドメインオブジェクトに変換 */
    for (const data of fetchData) res.push(new Department(data.id, data.name));

    return res;
  }

  public async insertDepartment(department: Department): Promise<void> {
    await this.db.Department.create({
      id: department.Id,
      name: department.Name,
    });
  }

  public async findByName(name: string | null): Promise<Department | null> {
    const fetchData = await this.db.Department.findOne({
      where: {name},
    });

    if (fetchData === null) return null;

    return new Department(fetchData.id, fetchData.name);
  }

  public async count(): Promise<number> {
    return await this.db.Department.count();
  }

  public async deleteDepartment(id: string): Promise<void> {
    await this.db.Department.destroy({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<Department | null> {
    const fetchData = await this.db.Department.findOne({
      where: {id},
    });

    if (fetchData === null) return null;

    return new Department(fetchData.id, fetchData.name);
  }

  public async update(department: Department): Promise<void> {
    await this.db.Department.update({
      name: department.Name,
    }, {where: {id: department.Id}});
  }

  public async findBookRequestById(departmentId: string): Promise<BookRequest[]> {
    const fetchData = await this.db.Request.findAll({
      where: {
        department_id: departmentId,
      },
    });

    if (fetchData === null) return [];

    const fetchDepartment = await this.db.Department.findOne({where: {id: departmentId}});

    if (fetchDepartment === null) throw new Error();

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
}
