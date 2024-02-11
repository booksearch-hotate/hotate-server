import Tag from "../../../../domain/model/tag/tag";
import TagData from "../tagData";

export default class TagFindByIdOutputData {
  public tag: TagData;

  public constructor(tag: Tag) {
    this.tag = new TagData(tag);
  }
}
