import Department from "../model/department/department";

export interface IDepartmentRepository {
  findAllDepartment(): Promise<Department[]>,
  insertDepartment(department: Department): Promise<void>,
  count(): Promise<number>,
  deleteDepartment(id: string): Promise<void>,
  findById(id: string): Promise<Department | null>,
  update(department: Department): Promise<void>,
  findByName (name: string | null): Promise<Department | null>,
}
