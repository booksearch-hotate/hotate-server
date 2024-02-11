import SchoolGradeInfo from "../../../../domain/model/schoolGradeInfo/schoolGradeInfo";
import SchoolGradeInfoData from "../schoolGradeInfoData";

export default class SchoolGradeInfoFindOutputData {
  public schoolGradeInfo: SchoolGradeInfoData;

  public constructor(schoolGradeInfo: SchoolGradeInfo) {
    this.schoolGradeInfo = new SchoolGradeInfoData(schoolGradeInfo);
  }
}
