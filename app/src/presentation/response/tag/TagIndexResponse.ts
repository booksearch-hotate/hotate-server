import TagFindAllOutputData from "../../dto/tag/findAll/TagFindAllOutputData";
import TagData from "../../dto/tag/tagData";
import TreeResponse from "../TreeResponse";

export default class TagIndexResponse extends TreeResponse<TagFindAllOutputData> {
  public tags: TagData[] = [];

  public success(o: TagFindAllOutputData) {
    this.tags = o.dataList;

    return this;
  }

  public error() {
    return this;
  }
}
