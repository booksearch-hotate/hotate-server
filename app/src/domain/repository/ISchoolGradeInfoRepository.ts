import SchoolGradeInfo from "../model/schoolGradeInfo/schoolGradeInfo";

export interface ISchoolGradeInfoRepository {
  find (): Promise<SchoolGradeInfo>
  update (schoolGradeInfo: SchoolGradeInfo): Promise<void>
}
