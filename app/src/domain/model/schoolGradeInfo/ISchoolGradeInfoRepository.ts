import SchoolGradeInfoModel from './schoolGradeInfoModel';

export interface ISchoolGradeInfoRepository {
  find (): Promise<SchoolGradeInfoModel>
  update (schoolGradeInfo: SchoolGradeInfoModel): Promise<void>
}
