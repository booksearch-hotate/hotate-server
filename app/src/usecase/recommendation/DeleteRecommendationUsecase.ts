import RecommendationId from "../../domain/model/recommendation/recommendationId";
import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationDeleteInputData from "../../presentation/dto/recommendation/delete/RecommendationDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteRecommendationUsecase implements Usecase<RecommendationDeleteInputData, Promise<void>> {
  constructor(private readonly recommendationDB: IRecommendationDBRepository) { }

  public async execute(input: RecommendationDeleteInputData): Promise<void> {
    const recommendation = await this.recommendationDB.findById(new RecommendationId(input.id));

    if (recommendation === null) throw new Error("削除対象のおすすめが見つかりませんでした。");

    await this.recommendationDB.delete(recommendation);
  }
}
