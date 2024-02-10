import Recommendation from "../../domain/model/recommendation/recommendation";
import RecommendationId from "../../domain/model/recommendation/recommendationId";
import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationInsertInputData from "../../presentation/dto/recommendation/insert/RecommendationInsertInputData";
import {Usecase} from "../Usecase";

export default class InsertRecommendationUseCase implements Usecase<RecommendationInsertInputData, Promise<void>> {
  constructor(
    private readonly recommendationDB: IRecommendationDBRepository,
  ) { }

  public async execute(input: RecommendationInsertInputData): Promise<void> {
    const maxIndex = await this.recommendationDB.fetchMaxIndex();
    const recommendation = new Recommendation(
        new RecommendationId(null),
        input.title,
        input.content,
        false,
        maxIndex + 1,
        input.thumbnailName,
        new Date(),
        new Date(),
        [],
    );

    await this.recommendationDB.save(recommendation);
  }
}
