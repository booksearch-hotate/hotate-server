import TreeResponse from "../TreeResponse";

export default class AddESByDBResponse extends TreeResponse<void> {
  public success() {
    return this;
  }
}
