import SchoolClass from './schoolClass';
import SchoolYear from './schoolYear';

export default class SchoolGradeInfo {
  private year: SchoolYear;
  private schoolClass: SchoolClass;

  constructor(year: SchoolYear, schoolClass: SchoolClass) {
    this.year = year;
    this.schoolClass = schoolClass;
  }

  get Year(): number {
    return this.year.Year;
  }
  get SchoolClass(): number {
    return this.schoolClass.SchoolClass;
  }
}
