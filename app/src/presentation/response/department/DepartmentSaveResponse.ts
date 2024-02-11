import TreeResponse from "../TreeResponse";

export default class DepartmentSaveResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
