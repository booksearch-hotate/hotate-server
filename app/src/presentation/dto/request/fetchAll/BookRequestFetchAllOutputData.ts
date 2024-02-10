import BookRequest from "../../../../domain/model/bookRequest/bookRequest";
import BookRequestData from "../bookRequestData";

export default class BookRequestFetchAllOutputData {
  public requests: BookRequestData[];

  constructor(requests: BookRequest[]) {
    this.requests = requests.map((request) => new BookRequestData(request));
  }
}
