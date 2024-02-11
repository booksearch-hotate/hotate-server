import CheckDuplicationBooksOutputData from "../../dto/health/checkDuplicationBooks/CheckDuplicationBooksOutputData";
import TreeResponse from "../TreeResponse";

export default class DuplicationResponse extends TreeResponse<CheckDuplicationBooksOutputData> {
  public names: string[] = [];

  public success(o: CheckDuplicationBooksOutputData) {
    this.names = o.names;

    return this;
  }
}
