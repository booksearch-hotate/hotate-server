import TreeResponse from "../TreeResponse";

export default class RequestSaveResponse extends TreeResponse<void> {
  public success(o: void) {
    return this;
  }

  public error() {
    return this;
  }
}
