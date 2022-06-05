export default class TagModel {
  private id: string;
  private name: string;
  private createdAt: Date | null;

  public constructor(id: string | undefined, name: string | undefined, createdAt: Date | null) {
    if (id === undefined) throw new Error('idが不明です');
    if (name === undefined) throw new Error('pwが不明です');

    if (name === '') throw new Error('nameが空です');

    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get CreatedAt(): Date | null {
    return this.createdAt;
  }
}
