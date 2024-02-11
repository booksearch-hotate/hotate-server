export default class SchoolGradeInfoUpdateInputData {
  public schoolYear: number;
  public schoolClass: number;

  public constructor(schoolYear: number, schoolClass: number) {
    this.schoolYear = schoolYear;
    this.schoolClass = schoolClass;
  }
}
