import TreeResponse from "../TreeResponse";

export default class DeleteAllBookResponse extends TreeResponse<void> {
  public success(o: void) {
    return this;
  }

  public error() {
    return this;
  }
}
