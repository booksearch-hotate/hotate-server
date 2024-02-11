import RecommendationId from "../../../../domain/model/recommendation/recommendationId";

export default class RecommendationFindInputData {
  public id: RecommendationId;

  public constructor(id: string) {
    this.id = new RecommendationId(id);
  }
}
