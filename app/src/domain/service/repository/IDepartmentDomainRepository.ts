import DepartmentModel from '../../model/departmentModel';

export interface IDepartmentDomainRepository {
  findByName (name: string | null): Promise<DepartmentModel | null>
};
