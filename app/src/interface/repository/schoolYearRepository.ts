import {PrismaClient} from '@prisma/client';
import {ISchoolGradeInfoRepository} from '../../domain/repository/ISchoolGradeInfoRepository';
import SchoolClass from '../../domain/model/schoolGradeInfo/schoolClass';
import SchoolGradeInfo from '../../domain/model/schoolGradeInfo/schoolGradeInfo';
import SchoolYear from '../../domain/model/schoolGradeInfo/schoolYear';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';


export default class SchoolYearRepository implements ISchoolGradeInfoRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  public async find(): Promise<SchoolGradeInfo> {
    const data = await this.db.school_grade_info.findFirst();

    if (data === null) throw new MySQLDBError('Grade information does not exist.');

    const year = data.year;
    const schoolClass = data.school_class;

    return new SchoolGradeInfo(new SchoolYear(year), new SchoolClass(schoolClass));
  }

  public async update(schoolGradeInfo: SchoolGradeInfo): Promise<void> {
    const year = schoolGradeInfo.Year;
    const schoolClass = schoolGradeInfo.SchoolClass;
    await this.db.school_grade_info.updateMany({data: {year, school_class: schoolClass}, where: {}});
  }
}
