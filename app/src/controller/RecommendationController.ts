import RecommendationFetchInputData from "../presentation/dto/recommendation/fetch/RecommendationFetchInputData";
import RecommendationFindInputData from "../presentation/dto/recommendation/find/RecommendationFindInputData";
import RecommendationFetchResponse from "../presentation/response/recommendation/RecommendationFetchResponse";
import RecommendationFindResponse from "../presentation/response/recommendation/RecommendationFindResponse";
import FetchRecommendationThumbnailUseCase from "../usecase/recommendation/FetchRecommendationThumbnailUsecase";
import FindRecommendationUseCase from "../usecase/recommendation/FindRecommendationUsecase";

export default class RecommendationController {
  private fetchRecommendationUseCase: FetchRecommendationThumbnailUseCase;
  private findRecommendationUseCase: FindRecommendationUseCase;

  public constructor(fetchRecommendationUseCase: FetchRecommendationThumbnailUseCase, findRecommendationUseCase: FindRecommendationUseCase) {
    this.fetchRecommendationUseCase = fetchRecommendationUseCase;
    this.findRecommendationUseCase = findRecommendationUseCase;
  }

  public async fetchRecommendation(pageCount: number, fetchMargin: number): Promise<RecommendationFetchResponse> {
    const res = new RecommendationFetchResponse();

    try {
      const input = new RecommendationFetchInputData(pageCount, fetchMargin);
      const output = await this.fetchRecommendationUseCase.execute(input);
      return res.success({recommendations: output});
    } catch (e: any) {
      return res.error(e as Error);
    }
  }

  public async findRecommendation(id: string): Promise<RecommendationFindResponse> {
    const res = new RecommendationFindResponse();

    try {
      const input = new RecommendationFindInputData(id);
      const output = await this.findRecommendationUseCase.execute(input);
      return res.success({recommendation: output});
    } catch (e: any) {
      return res.error();
    }
  }
}
