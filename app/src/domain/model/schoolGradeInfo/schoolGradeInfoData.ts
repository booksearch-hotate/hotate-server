import SchoolGradeInfoModel from './schoolGradeInfoModel';

export default class SchoolGradeInfoData {
  private year: number;
  private schoolClass: number;

  constructor(schoolGradeInfo: SchoolGradeInfoModel) {
    this.year = schoolGradeInfo.Year;
    this.schoolClass = schoolGradeInfo.SchoolClass;
  }

  get Year(): number {
    return this.year;
  }
  get SchoolClass(): number {
    return this.schoolClass;
  }
}
