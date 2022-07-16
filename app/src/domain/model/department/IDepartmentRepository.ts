import BookRequestModel from '../bookRequest/bookRequestModel';
import DepartmentModel from './departmentModel';

export interface IDepartmentRepository {
  findAllDepartment(): Promise<DepartmentModel[]>,
  insertDepartment(department: DepartmentModel): Promise<void>,
  count(): Promise<number>,
  deleteDepartment(id: string): Promise<void>,
  findById(id: string): Promise<DepartmentModel | null>,
  update(department: DepartmentModel): Promise<void>,
  findByName (name: string | null): Promise<DepartmentModel | null>,
  findBookRequestById(departmentId: string): Promise<BookRequestModel[]>
}
