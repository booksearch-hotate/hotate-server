import {PrismaClient} from "@prisma/client";
import {IDepartmentDBRepository} from "../../../domain/repository/db/IDepartmentDBRepository";
import Department from "../../../domain/model/department/department";
import DepartmentId from "../../../domain/model/department/departmentId";

export default class DepartmentPrismaRepository implements IDepartmentDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findAll(): Promise<Department[]> {
    const departments = await this.db.departments.findMany();

    return departments.map((department) => new Department(new DepartmentId(department.id), department.name));
  }

  public async findById(id: DepartmentId): Promise<Department | null> {
    const department = await this.db.departments.findFirst({where: {id: id.Id}});

    return department === null ? null : new Department(new DepartmentId(department.id), department.name);
  }

  public async save(department: Department): Promise<void> {
    await this.db.departments.create({
      data: {
        id: department.Id.Id,
        name: department.Name,
      },
    });
  }

  public async update(department: Department): Promise<void> {
    await this.db.departments.update({
      where: {id: department.Id.Id},
      data: {
        name: department.Name,
      },
    });
  }

  public async delete(department: Department): Promise<void> {
    await this.db.departments.delete({where: {id: department.Id.Id}});
  }

  public async findByName(name: string): Promise<Department | null> {
    const department = await this.db.departments.findFirst({where: {name: name}});

    return department === null ? null : new Department(new DepartmentId(department.id), department.name);
  }

  public async count(): Promise<number> {
    return await this.db.departments.count();
  }
}
