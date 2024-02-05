import {PrismaClient} from '@prisma/client';
import {IDepartmentRepository} from '../../domain/model/department/IDepartmentRepository';

import Department from '../../domain/model/department/department';

export default class DepartmentRepository implements IDepartmentRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findAllDepartment(): Promise<Department[]> {
    const fetchData = await this.db.departments.findMany(
        {
          orderBy: {created_at: 'desc'},
        },
    );

    const res: Department[] = [];

    /* ドメインオブジェクトに変換 */
    for (const data of fetchData) res.push(new Department(data.id, data.name));

    return res;
  }

  public async insertDepartment(department: Department): Promise<void> {
    await this.db.departments.create({
      data: {
        id: department.Id,
        name: department.Name,
      },
    });
  }

  public async findByName(name: string | null): Promise<Department | null> {
    if (name === null) return null;
    const fetchData = await this.db.departments.findFirst({
      where: {name},
    });

    if (fetchData === null) return null;

    return new Department(fetchData.id, fetchData.name);
  }

  public async count(): Promise<number> {
    return await this.db.departments.count();
  }

  public async deleteDepartment(id: string): Promise<void> {
    await this.db.departments.delete({
      where: {
        id,
      },
    });
  }

  public async findById(id: string): Promise<Department | null> {
    const fetchData = await this.db.departments.findFirst({
      where: {id},
    });

    if (fetchData === null) return null;

    return new Department(fetchData.id, fetchData.name);
  }

  public async update(department: Department): Promise<void> {
    await this.db.departments.update({
      where: {
        id: department.Id,
      },
      data: {
        name: department.Name,
      },
    });
  }
}
