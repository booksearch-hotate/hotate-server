import {conversionDateToString} from "../../../utils/conversionDate";
import Tag from "../../../domain/model/tag/tag";

export default class TagData {
  private id: string;
  private name: string;
  private createdAt: string | null;
  private bookIds: string[];

  public constructor(tagModel: Tag) {
    this.id = tagModel.Id.Id;
    this.name = tagModel.Name;
    this.createdAt = tagModel.CreatedAt !== null ? conversionDateToString(tagModel.CreatedAt) : null;
    this.bookIds = tagModel.BookIds;
  }

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get CreatedAt(): string | null {
    return this.createdAt;
  }
  get BookIds(): string[] {
    return this.bookIds;
  }
}
