import DepartmentModel from '../../domain/model/departmentModel';

export interface IDepartmentRepository {
  findAllDepartment(): Promise<DepartmentModel[]>,
}
