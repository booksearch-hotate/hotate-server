import {ISchoolGradeInfoRepository} from '../domain/model/schoolGradeInfo/ISchoolGradeInfoRepository';
import SchoolClassModel from '../domain/model/schoolGradeInfo/schoolClassModel';
import SchoolGradeInfoData from '../domain/model/schoolGradeInfo/schoolGradeInfoData';
import SchoolGradeInfoModel from '../domain/model/schoolGradeInfo/schoolGradeInfoModel';
import SchoolYearModel from '../domain/model/schoolGradeInfo/schoolYearModel';

export default class SchoolGradeInfoApplicationService {
  private readonly schoolGradeInfoRepository: ISchoolGradeInfoRepository;

  constructor(schoolGradeInfoRepository: ISchoolGradeInfoRepository) {
    this.schoolGradeInfoRepository = schoolGradeInfoRepository;
  }

  public async update(year: number, schoolClass: number): Promise<void> {
    const schoolYearModel = new SchoolYearModel(year);
    const schoolClassModel = new SchoolClassModel(schoolClass);

    await this.schoolGradeInfoRepository.update(new SchoolGradeInfoModel(schoolYearModel, schoolClassModel));
  }

  public async find(): Promise<SchoolGradeInfoData> {
    const schoolYear = await this.schoolGradeInfoRepository.find();

    return new SchoolGradeInfoData(schoolYear);
  }
}
