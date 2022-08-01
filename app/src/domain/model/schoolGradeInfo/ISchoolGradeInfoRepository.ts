import SchoolGradeInfo from './schoolGradeInfoModel';

export interface ISchoolGradeInfoRepository {
  find (): Promise<SchoolGradeInfo>
  update (schoolGradeInfo: SchoolGradeInfo): Promise<void>
}
