import TreeResponse from "../TreeResponse";

export default class UpdateBookResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
