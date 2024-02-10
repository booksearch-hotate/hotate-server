import RecommendationDeleteInputData from "../../presentation/dto/recommendation/delete/RecommendationDeleteInputData";
import RecommendationDetailResponse from "../../presentation/dto/recommendation/detail/RecommendationDetailResponse";
import RecommendationFetchInputData from "../../presentation/dto/recommendation/fetch/RecommendationFetchInputData";
import RecommendationFindInputData from "../../presentation/dto/recommendation/find/RecommendationFindInputData";
import RecommendationInsertInputData from "../../presentation/dto/recommendation/insert/RecommendationInsertInputData";
import RecommendationUpdateInputData from "../../presentation/dto/recommendation/update/RecommendationUpdateInputData";
import RecommendationAddResponse from "../../presentation/response/recommendation/RecommendationAddResponse";
import RecommendationDeleteResponse from "../../presentation/response/recommendation/RecommendationDeleteResponse";
import RecommendationFetchResponse from "../../presentation/response/recommendation/RecommendationFetchResponse";
import RecommendationInsertResponse from "../../presentation/response/recommendation/RecommendationInsertResponse";
import RecommendationUpdateResponse from "../../presentation/response/recommendation/RecommendationUpdateResponse";
import DeleteRecommendationUsecase from "../../usecase/recommendation/DeleteRecommendationUsecase";
import FetchMaxIndexRecommendationUseCase from "../../usecase/recommendation/FetchMaxIndexRecommendationUsecase";
import FetchRecommendationThumbnailUseCase from "../../usecase/recommendation/FetchRecommendationThumbnailUsecase";
import FetchThumbnailNamesUseCase from "../../usecase/thumbnail/FetchThumbnailNamesUsecase";
import FindRecommendationUseCase from "../../usecase/recommendation/FindRecommendationUsecase";
import InsertRecommendationUsecase from "../../usecase/recommendation/InsertRecommendationUsecase";
import UpdateRecommendationUseCase from "../../usecase/recommendation/UpdateRecommendationUsecase";
import isSameLenAllArray from "../../utils/isSameLenAllArray";

export default class RecommendationAdminController {
  public constructor(
      private readonly fetchRecommendationUsecase: FetchRecommendationThumbnailUseCase,
      private readonly findRecommendationsUsecase: FindRecommendationUseCase,
      private readonly fetchMaxIndexRecommendationUsecase: FetchMaxIndexRecommendationUseCase,
      private readonly fetchThumbnailNamesUsecase: FetchThumbnailNamesUseCase,
      private readonly updateRecommendationUsecase: UpdateRecommendationUseCase,
      private readonly insertRecommendationUsecase: InsertRecommendationUsecase,
      private readonly deleteRecommendationUsecase: DeleteRecommendationUsecase,
  ) { }

  public async index(pageCount: number, fetchMargin: number): Promise<RecommendationFetchResponse> {
    const response = new RecommendationFetchResponse();

    try {
      const input = new RecommendationFetchInputData(pageCount, fetchMargin);
      const output = await this.fetchRecommendationUsecase.execute(input);

      return response.success({recommendations: output});
    } catch (e) {
      return response.error();
    }
  }

  public async detail(id: string): Promise<RecommendationDetailResponse> {
    const response = new RecommendationDetailResponse();
    try {
      const recommendationInput = new RecommendationFindInputData(id);
      const recommendationOutput = await this.findRecommendationsUsecase.execute(recommendationInput);

      const maxIndex = await this.fetchMaxIndexRecommendationUsecase.execute();

      const thumbnailNames = await this.fetchThumbnailNamesUsecase.execute();

      return response.success(
          {
            recommendation: recommendationOutput,
            maxIndex: maxIndex,
            thumbnailOutput: thumbnailNames,
          },
      );
    } catch (e) {
      return response.error();
    }
  }

  public async update(
      id: string,
      title: string,
      content: string,
      thumbnailName: string,
      isSolid: boolean,
      formSortIndex: number,
      books: string[],
      comments: string[],
  ): Promise<RecommendationUpdateResponse> {
    const response = new RecommendationUpdateResponse();

    try {
      if (!isSameLenAllArray([books, comments])) throw new Error("入力情報が正しくありません。");

      const recommendationItems = books.map((book, index) => {
        return {
          bookId: book,
          comment: comments[index],
        };
      });

      const input = new RecommendationUpdateInputData(
          {id, title, content, thumbnailName, isSolid, formSortIndex, recommendationItems},
      );

      await this.updateRecommendationUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public add(): RecommendationAddResponse {
    const response = new RecommendationAddResponse();

    try {
      const output = this.fetchThumbnailNamesUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async insert(title: string, content: string, thumbnailName: string): Promise<RecommendationInsertResponse> {
    const response = new RecommendationInsertResponse();

    try {
      const input = new RecommendationInsertInputData(title, content, thumbnailName);

      await this.insertRecommendationUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async delete(id: string): Promise<RecommendationDeleteResponse> {
    const response = new RecommendationDeleteResponse();
    try {
      const input = new RecommendationDeleteInputData(id);

      await this.deleteRecommendationUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
