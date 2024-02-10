import TreeResponse from "../TreeResponse";

export default class DeleteESByDBResponse extends TreeResponse<void> {
  public success() {
    return this;
  }
}
