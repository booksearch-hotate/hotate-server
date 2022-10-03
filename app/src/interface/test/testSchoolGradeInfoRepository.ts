import {Db} from 'mongodb';
import {ISchoolGradeInfoRepository} from '../../domain/model/schoolGradeInfo/ISchoolGradeInfoRepository';
import SchoolClass from '../../domain/model/schoolGradeInfo/schoolClass';
import SchoolGradeInfo from '../../domain/model/schoolGradeInfo/schoolGradeInfo';
import SchoolYear from '../../domain/model/schoolGradeInfo/schoolYear';
import {SchoolGradeInfoCollectionName, schoolGradeInfoDocument} from '../../infrastructure/inMemory/collections/schoolGradeInfo';
import {NullDataError} from '../../presentation/error';
import {InMemoryDBError} from '../../presentation/error/infrastructure';

export default class TestSchoolGradeInfoRepository implements ISchoolGradeInfoRepository {
  db: Db;
  col;

  constructor(db: Db) {
    this.db = db;
    this.col = db.collection<schoolGradeInfoDocument>(SchoolGradeInfoCollectionName);
  }

  public async find(): Promise<SchoolGradeInfo> {
    const data = await this.col.findOne();

    if (data === null) throw new NullDataError('Grade information does not exist.');

    const year = data.year;
    const schoolClass = data.school_class;

    return new SchoolGradeInfo(new SchoolYear(year), new SchoolClass(schoolClass));
  }

  public async update(schoolGradeInfo: SchoolGradeInfo): Promise<void> {
    const year = schoolGradeInfo.Year;
    const schoolClass = schoolGradeInfo.SchoolClass;

    await this.col.updateOne({}, {
      school_class: schoolClass,
      year,
    });
  }

  async insertSchoolGradeInfo(info: SchoolGradeInfo) {
    if (await this.col.findOne() !== null) {
      throw new InMemoryDBError('Grades are already registered. It is possible that the initialization was not successful last time.');
    }

    await this.col.insertOne({
      school_class: info.SchoolClass,
      year: info.Year,
    });
  }
}
