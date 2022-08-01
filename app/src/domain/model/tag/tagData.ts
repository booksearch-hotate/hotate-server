import Tag from './tag';

export default class TagData {
  private id: string;
  private name: string;
  private createdAt: Date | null;
  private bookIds: string[];

  public constructor(tagModel: Tag) {
    this.id = tagModel.Id;
    this.name = tagModel.Name;
    this.createdAt = tagModel.CreatedAt;
    this.bookIds = tagModel.BookIds;
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
}
