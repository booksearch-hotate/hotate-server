import DepartmentModel from '../../domain/model/departmentModel';

export interface IDepartmentRepository {
  findAllDepartment(): Promise<DepartmentModel[]>,
  insertDepartment(department: DepartmentModel): Promise<void>,
  count(): Promise<number>,
  deleteDepartment(id: string): Promise<void>,
  findById(id: string): Promise<DepartmentModel | null>,
  update(department: DepartmentModel): Promise<void>,
}
