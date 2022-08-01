import Department from './department';

export default class DepartmentData {
  private id: string;
  private name: string;

  public constructor(department: Department) {
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
