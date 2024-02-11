import Recommendation from "../../../../domain/model/recommendation/recommendation";
import RecommendationData from "../RecommendationData";

export default class RecommendationOutputData {
  public recommendation: RecommendationData;

  public constructor(recommendation: Recommendation) {
    this.recommendation = new RecommendationData(recommendation);
  }
}
