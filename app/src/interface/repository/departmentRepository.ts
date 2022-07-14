import {IDepartmentRepository} from '../../domain/model/department/IDepartmentRepository';

import DepartmentModel from '../../domain/model/department/departmentModel';
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
}
