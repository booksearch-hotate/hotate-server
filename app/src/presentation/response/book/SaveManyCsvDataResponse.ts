import TreeResponse from "../TreeResponse";

export default class SaveManyCsvDataResponse extends TreeResponse<void> {
  public success(o: void) {
    return this;
  }

  public error() {
    return this;
  }
}
