import TagModel from '../../domain/model/tagModel';

export default class TagData {
  private id: string;
  private name: string;
  private createdAt: Date | null;
  private count: number;

  public constructor(tagModel: TagModel, count: number) {
    this.id = tagModel.Id;
    this.name = tagModel.Name;
    this.createdAt = tagModel.CreatedAt;
    this.count = count;
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
  get Count(): number {
    return this.count;
  }
}
