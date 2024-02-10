import BookRequest from "../../../../domain/model/bookRequest/bookRequest";
import BookRequestData from "../bookRequestData";

export default class RequestFindByIdOutputData {
  public request: BookRequestData;

  constructor(request: BookRequest) {
    this.request = new BookRequestData(request);
  }
}
