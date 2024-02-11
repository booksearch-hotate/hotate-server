import BookRequest from "../../../../domain/model/bookRequest/bookRequest";
import Department from "../../../../domain/model/department/department";
import BookRequestData from "../../request/bookRequestData";
import DepartmentData from "../departmentData";

export default class DepartmentConfirmDeleteOutputData {
  department: DepartmentData;
  requests: BookRequestData[];

  public constructor(department: Department, requests: BookRequest[]) {
    this.department = new DepartmentData(department);
    this.requests = requests.map((request) => new BookRequestData(request));
  }
}
