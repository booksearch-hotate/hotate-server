import Tag from "../../../../domain/model/tag/tag";
import TagData from "../tagData";

export default class TagFindAllOutputData {
  public dataList: TagData[];
  public constructor(tags: Tag[]) {
    this.dataList = tags.map((tag) => new TagData(tag));
  }
}
