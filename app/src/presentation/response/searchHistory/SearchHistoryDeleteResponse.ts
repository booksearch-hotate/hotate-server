import TreeResponse from "../TreeResponse";

export default class SearchHistoryDeleteResponse extends TreeResponse<void> {
  public success() {
    return this;
  }

  public error() {
    return this;
  }
}
