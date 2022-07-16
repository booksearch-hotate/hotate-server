import {IDepartmentRepository} from '../../domain/model/department/IDepartmentRepository';

import DepartmentModel from '../../domain/model/department/departmentModel';

import Department from '../../infrastructure/db/tables/departments';
import Request from '../../infrastructure/db/tables/requests';

import BookRequestModel from '../../domain/model/bookRequest/bookRequestModel';

interface sequelize {
  Department: typeof Department,
  Request: typeof Request,
}

export default class DepartmentRepository implements IDepartmentRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findAllDepartment(): Promise<DepartmentModel[]> {
    const fetchData = await this.db.Department.findAll({
      order: [['created_at', 'DESC']],
    });

    const res: DepartmentModel[] = [];

    /* ドメインオブジェクトに変換 */
    for (const data of fetchData) res.push(new DepartmentModel(data.id, data.name));

    return res;
  }

  public async insertDepartment(department: DepartmentModel): Promise<void> {
    await this.db.Department.create({
      id: department.Id,
      name: department.Name,
    });
  }

  public async findByName(name: string | null): Promise<DepartmentModel | null> {
    const fetchData = await this.db.Department.findOne({
      where: {name},
    });

    if (fetchData === null) return null;

    return new DepartmentModel(fetchData.id, fetchData.name);
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

  public async findById(id: string): Promise<DepartmentModel | null> {
    const fetchData = await this.db.Department.findOne({
      where: {id},
    });

    if (fetchData === null) return null;

    return new DepartmentModel(fetchData.id, fetchData.name);
  }

  public async update(department: DepartmentModel): Promise<void> {
    await this.db.Department.update({
      name: department.Name,
    }, {where: {id: department.Id}});
  }

  public async findBookRequestById(departmentId: string): Promise<BookRequestModel[]> {
    const fetchData = await this.db.Request.findAll({
      where: {
        department_id: departmentId,
      },
    });

    if (fetchData === null) return [];

    const fetchDepartment = await this.db.Department.findOne({where: {id: departmentId}});

    if (fetchDepartment === null) throw new Error();

    return fetchData.map((column) => new BookRequestModel(
        column.id,
        column.book_name,
        column.author_name,
        column.publisher_name,
        column.isbn,
        column.message,
        new DepartmentModel(column.department_id, fetchDepartment.name),
        column.school_year,
        column.school_class,
        column.user_name,
        column.created_at,
    ));
  }
}
