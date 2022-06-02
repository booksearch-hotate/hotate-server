export default class TagData {
  private id: string;
  private name: string;

  public constructor(id: string | undefined, name: string | undefined) {
    if (id === undefined) throw new Error('idが不明です');
    if (name === undefined) throw new Error('pwが不明です');

    if (name === '') throw new Error('nameが空です');

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
