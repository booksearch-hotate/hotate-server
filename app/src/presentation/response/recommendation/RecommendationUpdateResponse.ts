import TreeResponse from "../TreeResponse";

export default class RecommendationUpdateResponse extends TreeResponse<void> {
  public success(o: void) {
    return this;
  }

  public error() {
    return this;
  }
}
