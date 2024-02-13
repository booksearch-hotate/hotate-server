import Recommendation from "../../../../domain/model/recommendation/recommendation";
import RecommendationData from "../RecommendationData";

export default class RecommendationFetchOutputData {
  public recommendations: RecommendationData[];
  public count: number;

  constructor(recommendations: Recommendation[], totalCount: number) {
    this.recommendations = recommendations.map((recommendation) => new RecommendationData(recommendation));
    this.count = totalCount;
  }
}
