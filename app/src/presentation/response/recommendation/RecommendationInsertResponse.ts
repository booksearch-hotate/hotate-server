import TreeResponse from "../TreeResponse";

export default class RecommendationInsertResponse extends TreeResponse<void> {
  public success() {
    return this;
  }
}
