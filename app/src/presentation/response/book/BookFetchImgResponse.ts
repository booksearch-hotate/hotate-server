import BookFetchImgOutputData from "../../dto/book/fetchBookImg/BookFetchImgOutputData";
import TreeResponse from "../TreeResponse";

export default class BookFetchImgResponse extends TreeResponse<BookFetchImgOutputData> {
  public url: string | null = null;

  public success(output: BookFetchImgOutputData) {
    this.url = output.url;

    return this;
  }

  public error() {
    return this;
  }
}
