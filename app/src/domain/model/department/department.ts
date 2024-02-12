import {DomainInvalidError} from "../../../presentation/error";
import DepartmentId from "./departmentId";

export default class Department {
  private id: DepartmentId;
  private name: string;

  private readonly MAX_DEPARTMENT_LEN = 60;

  public constructor(id: DepartmentId, name: string) {
    if (name.length === 0 || name.length > this.MAX_DEPARTMENT_LEN) throw new DomainInvalidError(`学科名の文字数は1文字以上${this.MAX_DEPARTMENT_LEN}文字未満にしてください。`);

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
    if (name.length === 0 || name.length > this.MAX_DEPARTMENT_LEN) throw new DomainInvalidError(`学科名の文字数は1文字以上${this.MAX_DEPARTMENT_LEN}文字未満にしてください。`);

    this.name = name;
  }
}
