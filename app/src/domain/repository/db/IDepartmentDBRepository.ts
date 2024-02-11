import Department from "../../model/department/department";
import DepartmentId from "../../model/department/departmentId";

export interface IDepartmentDBRepository {
  findAll(): Promise<Department[]>;
  findById(id: DepartmentId): Promise<Department | null>;
  save(department: Department): Promise<void>;
  delete(department: Department): Promise<void>;
  update(department: Department): Promise<void>;
  findByName(name: string): Promise<Department | null>;
  count(): Promise<number>;
}
