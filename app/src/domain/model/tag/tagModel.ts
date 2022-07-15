export default class TagModel {
  private id: string;
  private name: string;
  private createdAt: Date | null;
  private bookIds: string[];

  public constructor(
      id: string | undefined,
      name: string | undefined,
      createdAt: Date | null,
      bookIds: string[],
  ) {
    if (id === undefined) throw new Error('idが不明です');
    if (name === undefined) throw new Error('pwが不明です');

    if (name === '') throw new Error('nameが空です');

    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.bookIds = bookIds;
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
  get BookIds(): string[] {
    return this.bookIds;
  }

  public changeName(name: string | null) {
    if (name === null) throw new Error('The tag name is null.');

    this.name = name;
  }
}
