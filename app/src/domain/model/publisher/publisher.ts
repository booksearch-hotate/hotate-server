export default class Publisher {
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

  public changeName(name: string) {
    this.name = name;
  }
}