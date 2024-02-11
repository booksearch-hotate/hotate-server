import TreeResponse from "../TreeResponse";

export default class SchoolGradeInfoUpdateResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
