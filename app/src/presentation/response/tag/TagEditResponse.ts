import TagFindByIdOutputData from "../../dto/tag/findById/TagFindByIdOutputData";
import TagData from "../../dto/tag/tagData";
import TreeResponse from "../TreeResponse";

export default class TagEditResponse extends TreeResponse<TagFindByIdOutputData> {
  public tag: TagData | null = null;

  public success(o: TagFindByIdOutputData) {
    this.tag = o.tag;

    return this;
  }

  public error() {
    return this;
  }
}
