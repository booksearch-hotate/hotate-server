import SchoolGradeInfo from './schoolGradeInfo';

export interface ISchoolGradeInfoRepository {
  find (): Promise<SchoolGradeInfo>
  update (schoolGradeInfo: SchoolGradeInfo): Promise<void>
}
