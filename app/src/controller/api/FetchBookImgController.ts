import BookFetchImgInputData from "../../presentation/dto/book/fetchBookImg/BookFetchImgInputData";
import BookFetchImgOutputData from "../../presentation/dto/book/fetchBookImg/BookFetchImgOutputData";
import BookFetchImgResponse from "../../presentation/response/book/BookFetchImgResponse";
import FetchBookImgUseCase from "../../usecase/book/FetchBookImgUsecase";

export default class FetchBookImgController {
  constructor(private readonly fetchBookImgUsecase: FetchBookImgUseCase) {}

  public async fetchBookImg(isbn: string | null): Promise<BookFetchImgResponse> {
    const response = new BookFetchImgResponse();

    try {
      if (isbn === null) return response.success(new BookFetchImgOutputData(null));

      const input = new BookFetchImgInputData(isbn);
      const output = await this.fetchBookImgUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }
}
