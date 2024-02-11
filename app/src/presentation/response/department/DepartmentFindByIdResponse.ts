import DepartmentData from "../../dto/department/departmentData";
import DepartmentFindByIdOutputData from "../../dto/department/findById/DepartmentFindByIdOutputData";
import TreeResponse from "../TreeResponse";

export default class DepartmentFindByIdResponse extends TreeResponse<DepartmentFindByIdOutputData> {
  public department: DepartmentData | null = null;

  public success(o: DepartmentFindByIdOutputData) {
    this.department = o.department;
    return this;
  }

  public error() {
    return this;
  }
}
