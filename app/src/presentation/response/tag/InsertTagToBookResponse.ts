import TreeResponse from "../TreeResponse";

export type TagInsertControllerOutputData = {
  isExistCombination: boolean;
}

export default class InsertTagToBookResponse extends TreeResponse<TagInsertControllerOutputData> {
  public isExistCombination: boolean | null = null;

  public success(TagInsertControllerOutputData: TagInsertControllerOutputData) {
    this.isExistCombination = TagInsertControllerOutputData.isExistCombination;
    return this;
  }

  public error() {
    return this;
  }
}
