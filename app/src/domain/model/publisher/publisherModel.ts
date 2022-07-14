export default class PublisherModel {
  private id: string;
  private name!: string | null;

  public constructor(id: string, name: string | null) {
    if (id === null) throw new Error('idがnullです');

    this.id = id;
    this.Name = name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }
  set Name(name: string | null) {
    this.name = name;
  }
}
