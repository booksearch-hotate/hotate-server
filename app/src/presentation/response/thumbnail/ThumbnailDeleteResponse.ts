import TreeResponse from "../TreeResponse";

export default class ThumbnailDeleteResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
