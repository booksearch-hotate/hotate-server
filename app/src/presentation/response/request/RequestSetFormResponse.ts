import DepartmentData from "../../dto/department/departmentData";
import RequestSetOutputData from "../../dto/request/setForm/RequestSetOutputData";
import SchoolGradeInfoData from "../../dto/schoolGradeInfo/schoolGradeInfoData";
import TreeResponse from "../TreeResponse";

export type RequestSetFormControllerResponse = {
  department: RequestSetOutputData;
}

export default class RequestSetFormResponse extends TreeResponse<RequestSetFormControllerResponse> {
  public departmentList: DepartmentData[] = [];
  public schoolGradeInfo: SchoolGradeInfoData | null = null;

  public success(o: RequestSetFormControllerResponse) {
    this.departmentList = o.department.departmentList;
    this.schoolGradeInfo = o.department.schoolGradeInfo;

    return this;
  }

  public error() {
    return this;
  }
}
