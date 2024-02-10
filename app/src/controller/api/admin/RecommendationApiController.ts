import BookFetchEmptyOutputData from "../../../presentation/dto/book/fetchBook/BookFetchEmptyOutputData";
import BookFetchInputData from "../../../presentation/dto/book/fetchBook/BookFetchInputData";
import RecommendationFindInputData from "../../../presentation/dto/recommendation/find/RecommendationFindInputData";
import RecommendationAddBookResponse from "../../../presentation/response/recommendation/api/RecommendationAddBookResponse";
import FetchBookUsecase from "../../../usecase/book/FetchBookUsecase";
import FetchThumbnailNamesUseCase from "../../../usecase/thumbnail/FetchThumbnailNamesUsecase";
import FindRecommendationUseCase from "../../../usecase/recommendation/FindRecommendationUsecase";
import ThumbnailSaveInputData from "../../../presentation/dto/thumbnail/save/ThumbnailSaveInputData";
import SaveThumbnailUseCase from "../../../usecase/thumbnail/SaveThumbnailUsecase";
import ThumbnailSaveResponse from "../../../presentation/response/thumbnail/ThumbnailSaveResponse";
import DeleteThumbnailUseCase from "../../../usecase/thumbnail/DeleteThumbnailUsecase";
import ThumbnailDeleteResponse from "../../../presentation/response/thumbnail/ThumbnailDeleteResponse";
import ThumbnailDeleteInputData from "../../../presentation/dto/thumbnail/delete/ThumbnailDeleteInputData";

export default class RecommendationApiController {
  constructor(
    private readonly findRecommendationUsecase: FindRecommendationUseCase,
    private readonly findBookUsecase: FetchBookUsecase,
    private readonly fetchThumbnailNamesUsecase: FetchThumbnailNamesUseCase,
    private readonly saveThumbnailUsecase: SaveThumbnailUseCase,
    private readonly deleteThumbnailUsecase: DeleteThumbnailUseCase,
  ) {}

  public async bookAdd(recommendationId: string, bookId: string): Promise<RecommendationAddBookResponse> {
    const response = new RecommendationAddBookResponse();

    try {
      const recommendationInput = new RecommendationFindInputData(recommendationId);
      const recommendationOutput = await this.findRecommendationUsecase.execute(recommendationInput);

      const bookInput = new BookFetchInputData(bookId);
      const bookOutput = await this.findBookUsecase.execute(bookInput);

      if (recommendationOutput === null || bookOutput instanceof BookFetchEmptyOutputData) {
        throw new Error("Failed to find recommendation or book");
      }

      const isExist = recommendationOutput.recommendation.RecommendationItems.some((book) => book.Book.Id === bookOutput.book.Id);

      return response.success({isExistBook: isExist, book: bookOutput});
    } catch (e) {
      return response.error();
    }
  }

  public async thumbnailAdd(inputFileName: string): Promise<ThumbnailSaveResponse> {
    const response = new ThumbnailSaveResponse();

    try {
      const thumbnailNames = this.fetchThumbnailNamesUsecase.execute();

      const MAX_THUMBNAIL_LEN = 10;

      if (thumbnailNames.allTypeNames.length >= MAX_THUMBNAIL_LEN) {
        throw new Error(`サムネイルは${MAX_THUMBNAIL_LEN}個までしか登録できません。`);
      }

      const saveThumbnailInput = new ThumbnailSaveInputData(inputFileName);

      const thumbnailSaveOutput = await this.saveThumbnailUsecase.execute(saveThumbnailInput);

      return response.success(thumbnailSaveOutput);
    } catch (e) {
      return response.error();
    }
  }

  public thumbnailDelete(deleteFile: string): ThumbnailDeleteResponse {
    const response = new ThumbnailDeleteResponse();

    try {
      const input = new ThumbnailDeleteInputData(deleteFile);

      this.deleteThumbnailUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
