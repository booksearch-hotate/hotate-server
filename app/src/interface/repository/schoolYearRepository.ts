import {ISchoolGradeInfoRepository} from '../../domain/model/schoolGradeInfo/ISchoolGradeInfoRepository';
import SchoolClass from '../../domain/model/schoolGradeInfo/schoolClass';
import SchoolGradeInfo from '../../domain/model/schoolGradeInfo/schoolGradeInfo';
import SchoolYear from '../../domain/model/schoolGradeInfo/schoolYear';
import SchoolGradeInfoTable from '../../infrastructure/db/tables/schoolGradeInfo';
import {MySQLDBError} from '../../presentation/error/infrastructure';

interface sequelize {
  SchoolGradeInfo: typeof SchoolGradeInfoTable,
}

export default class SchoolYearRepository implements ISchoolGradeInfoRepository {
  private readonly db: sequelize;

  constructor(db: sequelize) {
    this.db = db;
  }

  public async find(): Promise<SchoolGradeInfo> {
    const data = await this.db.SchoolGradeInfo.findOne();

    if (data === null) throw new MySQLDBError('Grade information does not exist.');

    const year = data.year;
    const schoolClass = data.school_class;

    return new SchoolGradeInfo(new SchoolYear(year), new SchoolClass(schoolClass));
  }

  public async update(schoolGradeInfo: SchoolGradeInfo): Promise<void> {
    const year = schoolGradeInfo.Year;
    const schoolClass = schoolGradeInfo.SchoolClass;
    await this.db.SchoolGradeInfo.update({year, school_class: schoolClass}, {where: {}});
  }
}
