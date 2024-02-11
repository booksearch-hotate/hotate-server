import BookRequestData from "../../dto/request/bookRequestData";
import RequestFindByIdOutputData from "../../dto/request/findById/RequestFindByIdOutputData";
import TreeResponse from "../TreeResponse";

export default class RequestFindByIdResponse extends TreeResponse<RequestFindByIdOutputData> {
  public request: BookRequestData | null = null;

  public success(o: RequestFindByIdOutputData) {
    this.request = o.request;
    return this;
  }

  public error() {
    return this;
  }
}
