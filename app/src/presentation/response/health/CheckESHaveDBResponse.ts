import CheckESHaveDBOutputData from "../../dto/health/checkESHaveDB/CheckESHaveDBOutputData";
import TreeResponse from "../TreeResponse";

export default class CheckESHaveDBResponse extends TreeResponse<CheckESHaveDBOutputData> {
  public ids: string[] = [];

  public success(o: CheckESHaveDBOutputData) {
    this.ids = o.ids;

    return this;
  }
}
