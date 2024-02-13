import RecommendationFetchInputData from "../presentation/dto/recommendation/fetch/RecommendationFetchInputData";
import RecommendationFetchResponse from "../presentation/response/recommendation/RecommendationFetchResponse";
import FetchRecommendationThumbnailUseCase from "../usecase/recommendation/FetchRecommendationThumbnailUsecase";

export default class HomeController {
  private fetchRecommendationUseCase: FetchRecommendationThumbnailUseCase;
  private readonly RECOMMENDATION_FETCH_LIMIT = 9; // 画面に表示するおすすめの数

  public constructor(fetchRecommendationUseCase: FetchRecommendationThumbnailUseCase) {
    this.fetchRecommendationUseCase = fetchRecommendationUseCase;
  }

  public async fetchRecommendation(): Promise<RecommendationFetchResponse> {
    const res = new RecommendationFetchResponse();
    try {
      const input = new RecommendationFetchInputData(0, this.RECOMMENDATION_FETCH_LIMIT);

      const output = await this.fetchRecommendationUseCase.execute(input);
      return res.success({recommendations: output});
    } catch (e: any) {
      return res.error(e as Error);
    }
  }
}
