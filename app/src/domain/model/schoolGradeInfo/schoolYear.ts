import {DomainInvalidError} from "../../../presentation/error";

export default class SchoolYear {
  private year: number;

  private readonly MAX_SCHOOLYEAR_NUM = 10;

  constructor(year: number) {
    if (year < 0 || year > this.MAX_SCHOOLYEAR_NUM) throw new DomainInvalidError(`The grade range is incorrect. The range is from 1 to ${this.MAX_SCHOOLYEAR_NUM}. But you have set ${year}.`);

    this.year = year;
  }

  get Year() {
    return this.year;
  }

  public changeYear(year: number) {
    if (year < 0 || year > this.MAX_SCHOOLYEAR_NUM) throw new DomainInvalidError(`The grade range is incorrect. The range is from 1 to ${this.MAX_SCHOOLYEAR_NUM}. But you have set ${year}.`);

    this.year = year;
  }
}
