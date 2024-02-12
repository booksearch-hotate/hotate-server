import BookRequestData from "../../dto/request/bookRequestData";
import RequestMakeOutputData from "../../dto/request/makeRequestData/RequestMakeOutputData";
import TreeResponse from "../TreeResponse";

export type RequestMakeDataControllerOutputData = {
  data: RequestMakeOutputData;
}

export default class RequestMakeDataResponse extends TreeResponse<RequestMakeDataControllerOutputData> {
  public data: BookRequestData | null = null;

  public success(o: RequestMakeDataControllerOutputData) {
    this.data = o.data.request;
    return this;
  }
}
