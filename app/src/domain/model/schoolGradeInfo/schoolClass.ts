import {DomainInvalidError} from '../../../presentation/error';

export default class SchoolClass {
  private schoolClass: number;

  private readonly MAX_SCHOOLYEAR_NUM = 10;

  constructor(schoolClass: number) {
    if (schoolClass < 0 || schoolClass > this.MAX_SCHOOLYEAR_NUM) throw new DomainInvalidError(`The grade range is incorrect. The range is from 1 to ${this.MAX_SCHOOLYEAR_NUM}. But you have set ${schoolClass}.`);

    this.schoolClass = schoolClass;
  }

  get SchoolClass() {
    return this.schoolClass;
  }

  public changeClass(schoolClass: number) {
    if (schoolClass < 0 || schoolClass > this.MAX_SCHOOLYEAR_NUM) throw new DomainInvalidError(`The grade range is incorrect. The range is from 1 to ${this.MAX_SCHOOLYEAR_NUM}. But you have set ${schoolClass}.`);

    this.schoolClass = schoolClass;
  }
}
