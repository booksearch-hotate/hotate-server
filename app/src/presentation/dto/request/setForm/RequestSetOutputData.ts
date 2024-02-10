import Department from "../../../../domain/model/department/department";
import SchoolGradeInfo from "../../../../domain/model/schoolGradeInfo/schoolGradeInfo";
import DepartmentData from "../../department/departmentData";
import SchoolGradeInfoData from "../../schoolGradeInfo/schoolGradeInfoData";

export default class RequestSetOutputData {
  public departmentList: DepartmentData[];
  public schoolGradeInfo: SchoolGradeInfoData;

  constructor(departmentList: Department[], schoolGradeInfo: SchoolGradeInfo) {
    this.departmentList = departmentList.map((department) => new DepartmentData(department));
    this.schoolGradeInfo = new SchoolGradeInfoData(schoolGradeInfo);
  }
}
