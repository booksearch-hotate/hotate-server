import BookRequest from "../../../../domain/model/bookRequest/bookRequest";
import BookRequestData from "../bookRequestData";

export default class RequestMakeOutputData {
  public request: BookRequestData;

  public constructor(model: BookRequest) {
    this.request = new BookRequestData(model);
  }
}
