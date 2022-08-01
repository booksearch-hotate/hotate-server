import {ISchoolGradeInfoRepository} from '../../domain/model/schoolGradeInfo/ISchoolGradeInfoRepository';
import SchoolClassModel from '../../domain/model/schoolGradeInfo/schoolClassModel';
import SchoolGradeInfoModel from '../../domain/model/schoolGradeInfo/schoolGradeInfoModel';
import SchoolYearModel from '../../domain/model/schoolGradeInfo/schoolYearModel';
import SchoolGradeInfoTable from '../../infrastructure/db/tables/schoolGradeInfo';

interface sequelize {
  SchoolGradeInfo: typeof SchoolGradeInfoTable,
}

export default class SchoolYearRepository implements ISchoolGradeInfoRepository {
  private readonly db: sequelize;

  constructor(db: sequelize) {
    this.db = db;
  }

  public async find(): Promise<SchoolGradeInfoModel> {
    const data = await this.db.SchoolGradeInfo.findOne();

    if (data === null) throw new Error('Grade information does not exist.');

    const year = data.year;
    const schoolClass = data.school_class;

    return new SchoolGradeInfoModel(new SchoolYearModel(year), new SchoolClassModel(schoolClass));
  }

  public async update(schoolGradeInfo: SchoolGradeInfoModel): Promise<void> {
    const year = schoolGradeInfo.Year;
    const schoolClass = schoolGradeInfo.SchoolClass;
    await this.db.SchoolGradeInfo.update({year, school_class: schoolClass}, {where: {}});
  }
}
