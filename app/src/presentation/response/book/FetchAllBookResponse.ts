import BookData from "../../dto/book/BookData";
import BookFetchAllOutputData from "../../dto/book/fetchAll/BookFetchAllOutputData";
import TreeResponse from "../TreeResponse";

export type FetchAllBookControllerOutput = {
  res: BookFetchAllOutputData
}

export default class FetchAllBookResponse extends TreeResponse<FetchAllBookControllerOutput> {
  public books: BookData[] = [];
  public count: number | null = null;

  public success(o: FetchAllBookControllerOutput) {
    this.books = o.res.books;
    this.count = o.res.total;
    return this;
  }

  public error() {
    return this;
  }
}
