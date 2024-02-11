import SchoolGradeInfo from "../../model/schoolGradeInfo/schoolGradeInfo";

export interface ISchoolGradeInfoDBRepository {
  find(): Promise<SchoolGradeInfo | null>;
  update(SchoolGradeInfo: SchoolGradeInfo): Promise<void>;
}
