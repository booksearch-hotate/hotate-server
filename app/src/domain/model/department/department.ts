import {DomainInvalidError} from "../../../presentation/error";
import DepartmentId from "./departmentId";

export default class Department {
  private id: DepartmentId;
  private name: string;

  private readonly MAX_DEPARTMENT_LEN = 60;

  public constructor(id: DepartmentId, name: string) {
    if (name.length === 0 || name.length > this.MAX_DEPARTMENT_LEN) throw new DomainInvalidError(`The format of the name of department is different. Name of department: ${name}`);

    this.id = id;
    this.name = name;
  }

  get Id(): DepartmentId {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }

  public changeName(name: string): void {
    if (name.length === 0 || name.length > this.MAX_DEPARTMENT_LEN) throw new DomainInvalidError(`The format of the name of department is different. Name of department: ${name}`);

    this.name = name;
  }
}
