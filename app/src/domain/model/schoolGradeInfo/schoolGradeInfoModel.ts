import SchoolClassModel from './schoolClassModel';
import SchoolYearModel from './schoolYearModel';

export default class SchoolGradeInfoModel {
  private year: SchoolYearModel;
  private schoolClass: SchoolClassModel;

  constructor(year: SchoolYearModel, schoolClass: SchoolClassModel) {
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
