import CheckDBHaveESOutputData from "../../dto/health/checkDBHaveES/CheckDBHaveESOutputData";
import TreeResponse from "../TreeResponse";

export default class CheckDBHaveESResponse extends TreeResponse<CheckDBHaveESOutputData> {
  public ids: string[] = [];

  public success(o: CheckDBHaveESOutputData) {
    this.ids = o.ids;

    return this;
  }
}
