import Department from "../../../../domain/model/department/department";
import DepartmentData from "../departmentData";

export default class DepartmentFindAllOutputData {
  public departments: DepartmentData[];
  public isMax: boolean;

  public constructor(departments: Department[], isMax: boolean) {
    this.departments = departments.map((department) => new DepartmentData(department));
    this.isMax = isMax;
  }
}
