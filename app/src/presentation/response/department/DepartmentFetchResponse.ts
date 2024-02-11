import DepartmentData from "../../dto/department/departmentData";
import DepartmentFindAllOutputData from "../../dto/department/findAll/DepartmentFindAllOutputData";
import SchoolGradeInfoFindOutputData from "../../dto/schoolGradeInfo/find/SchoolGradeInfoFindOutputData";
import SchoolGradeInfoData from "../../dto/schoolGradeInfo/schoolGradeInfoData";
import TreeResponse from "../TreeResponse";

export type DepartmentFetchAdminControllerOutputData = {
  departments: DepartmentFindAllOutputData;
  schoolGradeInfo: SchoolGradeInfoFindOutputData;
}

export default class DepartmentFetchResponse extends TreeResponse<DepartmentFetchAdminControllerOutputData> {
  public departments: DepartmentData[] = [];
  public isMax: boolean | null = null;
  public schoolGradeInfo: SchoolGradeInfoData | null = null;

  public success(o: DepartmentFetchAdminControllerOutputData) {
    this.departments = o.departments.departments;
    this.isMax = o.departments.isMax;
    this.schoolGradeInfo = o.schoolGradeInfo.schoolGradeInfo;

    return this;
  }

  public error() {
    return this;
  }
}
