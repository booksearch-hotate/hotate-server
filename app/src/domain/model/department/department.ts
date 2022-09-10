import {DomainInvalidError} from '../../../presentation/error';

export default class Department {
  private id: string;
  private name: string;

  private readonly MAX_DEPARTMENT_LEN = 60;

  public constructor(id: string, name: string) {
    if (name.length === 0 || name.length > this.MAX_DEPARTMENT_LEN) throw new DomainInvalidError(`The format of the name of department is different. Name of department: ${name}`);

    this.id = id;
    this.name = name;
  }

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
}
