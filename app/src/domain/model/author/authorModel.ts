export default class AuthorModel {
  private id: string;
  private name!: string | null;

  public constructor(id: string, name: string | null) {
    if (id === null) throw new Error('idがnullです');

    this.id = id;
    this.name = name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }

  changeName(name: string) {
    this.name = name;
  }
}
