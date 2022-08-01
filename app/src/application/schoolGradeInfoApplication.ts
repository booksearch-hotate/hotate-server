import {ISchoolGradeInfoRepository} from '../domain/model/schoolGradeInfo/ISchoolGradeInfoRepository';
import SchoolClass from '../domain/model/schoolGradeInfo/schoolClassModel';
import SchoolGradeInfoData from '../domain/model/schoolGradeInfo/schoolGradeInfoData';
import SchoolGradeInfo from '../domain/model/schoolGradeInfo/schoolGradeInfoModel';
import SchoolYear from '../domain/model/schoolGradeInfo/schoolYearModel';

export default class SchoolGradeInfoApplicationService {
  private readonly schoolGradeInfoRepository: ISchoolGradeInfoRepository;

  constructor(schoolGradeInfoRepository: ISchoolGradeInfoRepository) {
    this.schoolGradeInfoRepository = schoolGradeInfoRepository;
  }

  public async update(year: number, schoolClass: number): Promise<void> {
    const schoolYearModel = new SchoolYear(year);
    const schoolClassModel = new SchoolClass(schoolClass);

    await this.schoolGradeInfoRepository.update(new SchoolGradeInfo(schoolYearModel, schoolClassModel));
  }

  public async find(): Promise<SchoolGradeInfoData> {
    const schoolYear = await this.schoolGradeInfoRepository.find();

    return new SchoolGradeInfoData(schoolYear);
  }
}
