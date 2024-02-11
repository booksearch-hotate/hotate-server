import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationFindInputData from "../../presentation/dto/recommendation/find/RecommendationFindInputData";
import RecommendationFindOutputData from "../../presentation/dto/recommendation/find/RecommendationFindOutputData";
import {Usecase} from "../Usecase";

export default class FindRecommendationUseCase implements Usecase<
RecommendationFindInputData, Promise<RecommendationFindOutputData>
> {
  private readonly recommendationDB: IRecommendationDBRepository;

  public constructor(recommendationDB: IRecommendationDBRepository) {
    this.recommendationDB = recommendationDB;
  }

  public async execute(input: RecommendationFindInputData): Promise<RecommendationFindOutputData> {
    const recommendation = await this.recommendationDB.findById(input.id);
    if (recommendation === null) throw new Error("Recommendation not found");
    return new RecommendationFindOutputData(recommendation);
  }
}
