import BookRequestData from "../../dto/request/bookRequestData";
import BookRequestFetchAllOutputData from "../../dto/request/fetchAll/BookRequestFetchAllOutputData";
import TreeResponse from "../TreeResponse";

export default class RequestFetchAllResponse extends TreeResponse<BookRequestFetchAllOutputData> {
  public requests: BookRequestData[] = [];

  public success(o: BookRequestFetchAllOutputData) {
    this.requests = o.requests;
    return this;
  }

  public error() {
    return this;
  }
}
