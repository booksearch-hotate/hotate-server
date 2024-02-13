import DepartmentConfirmDeleteOutputData from "../../dto/department/confirmDelete/DepartmentConfirmDeleteOutputData";
import DepartmentData from "../../dto/department/departmentData";
import BookRequestData from "../../dto/request/bookRequestData";
import TreeResponse from "../TreeResponse";

export default class DepartmentConfirmDeleteResponse extends TreeResponse<DepartmentConfirmDeleteOutputData> {
  public department: DepartmentData | null = null;
  public requests: BookRequestData[] = [];

  public success(o: DepartmentConfirmDeleteOutputData) {
    this.department = o.department;
    this.requests = o.requests;
    return this;
  }

  public error() {
    return this;
  }
}
