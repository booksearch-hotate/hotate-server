import TreeResponse from "../TreeResponse";

export default class UserUpdateResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
