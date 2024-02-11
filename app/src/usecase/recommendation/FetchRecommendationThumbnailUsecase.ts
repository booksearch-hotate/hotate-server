import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationFetchInputData from "../../presentation/dto/recommendation/fetch/RecommendationFetchInputData";
import RecommendationFetchOutputData from "../../presentation/dto/recommendation/fetch/RecommendationFetchOutputData";
import {Usecase} from "../Usecase";

export default class FetchRecommendationThumbnailUseCase implements Usecase<
  RecommendationFetchInputData, Promise<RecommendationFetchOutputData>
> {
  constructor(
    private readonly recommendationDB: IRecommendationDBRepository,
  ) { }

  public async execute(input: RecommendationFetchInputData): Promise<RecommendationFetchOutputData> {
    const fetchOutput = await this.recommendationDB.fetch(input.pageCount, input.count);
    const totalCount = await this.recommendationDB.count();

    return new RecommendationFetchOutputData(fetchOutput, totalCount);
  }
}
