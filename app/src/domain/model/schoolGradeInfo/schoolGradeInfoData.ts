import SchoolGradeInfo from './schoolGradeInfo';

export default class SchoolGradeInfoData {
  private year: number;
  private schoolClass: number;

  constructor(schoolGradeInfo: SchoolGradeInfo) {
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
