import {IDepartmentRepository} from '../../application/repository/IDepartmentApplicationRepository';

import DepartmentModel from '../../domain/model/departmentModel';
import Department from '../../infrastructure/db/tables/departments';

interface sequelize {
  Department: typeof Department
}

export default class DepartmentRepository implements IDepartmentRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
  }

  public async findAllDepartment(): Promise<DepartmentModel[]> {
    const fetchData = await this.db.Department.findAll();

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
}
