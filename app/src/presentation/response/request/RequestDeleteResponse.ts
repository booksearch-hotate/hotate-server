import TreeResponse from "../TreeResponse";

export default class RequestDeleteResponse extends TreeResponse<void> {
  public success(): this {
    return this;
  }

  public error(): this {
    return this;
  }
}
