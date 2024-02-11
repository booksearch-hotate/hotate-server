import {IBookImgRepository} from "../../domain/repository/bookImg/IBookImgRepository";
import BookFetchImgInputData from "../../presentation/dto/book/fetchBookImg/BookFetchImgInputData";
import BookFetchImgOutputData from "../../presentation/dto/book/fetchBookImg/BookFetchImgOutputData";
import {Usecase} from "../Usecase";

export default class FetchBookImgUseCase implements Usecase<BookFetchImgInputData, Promise<BookFetchImgOutputData>> {
  constructor(private readonly bookImgRepo: IBookImgRepository) {}

  public async execute(input: BookFetchImgInputData): Promise<BookFetchImgOutputData> {
    return new BookFetchImgOutputData(await this.bookImgRepo.fetchBookImg(input.isbn));
  }
}
