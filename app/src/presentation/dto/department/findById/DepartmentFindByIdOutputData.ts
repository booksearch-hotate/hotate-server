import Department from "../../../../domain/model/department/department";
import DepartmentData from "../departmentData";

export default class DepartmentFindByIdOutputData {
  public department: DepartmentData;

  public constructor(department: Department) {
    this.department = new DepartmentData(department);
  }
}
