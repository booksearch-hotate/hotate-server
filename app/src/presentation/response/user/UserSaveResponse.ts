import TreeResponse from "../TreeResponse";

export default class UserSaveResponse extends TreeResponse<void> {
  public success() {
    return this;
  }
}
