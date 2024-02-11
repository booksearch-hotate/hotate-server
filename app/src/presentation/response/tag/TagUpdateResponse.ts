import TreeResponse from "../TreeResponse";

export default class TagUpdateResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
