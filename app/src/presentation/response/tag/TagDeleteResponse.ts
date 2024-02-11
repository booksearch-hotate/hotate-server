import TreeResponse from "../TreeResponse";

export default class TagDeleteResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
