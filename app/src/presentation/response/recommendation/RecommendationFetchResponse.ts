import RecommendationFetchOutputData from "../../dto/recommendation/fetch/RecommendationFetchOutputData";
import TreeResponse from "../TreeResponse";
import RecommendationData from "../../dto/recommendation/RecommendationData";

export type FetchRecommendationControllerOutputData = {
  recommendations: RecommendationFetchOutputData;
}

export default class RecommendationFetchResponse extends TreeResponse<FetchRecommendationControllerOutputData> {
  public recommendations: RecommendationData[] = [];
  public count: number | null = -1;

  public success(output: FetchRecommendationControllerOutputData) {
    this.recommendations = output.recommendations.recommendations;
    this.count = output.recommendations.count;
    return this;
  }
}
