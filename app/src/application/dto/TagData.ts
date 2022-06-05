import TagModel from '../../domain/model/tagModel';

export default class TagData {
  private id: string;
  private name: string;
  private createdAt: Date | null;

  public constructor(tagModel: TagModel) {
    this.id = tagModel.Id;
    this.name = tagModel.Name;
    this.createdAt = tagModel.CreatedAt;
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
