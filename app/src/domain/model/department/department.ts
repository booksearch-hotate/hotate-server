export default class Department {
  private id: string;
  private name: string;

  public constructor(id: string, name: string) {
    if (name.length === 0) throw new Error('The name of the department is empty.');

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
