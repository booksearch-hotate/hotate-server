import DepartmentModel from '../../domain/model/department/departmentModel';

export default class DepartmentData {
  private id: string;
  private name: string;

  public constructor(department: DepartmentModel) {
    this.id = department.Id;
    this.name = department.Name;
  }

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
}
