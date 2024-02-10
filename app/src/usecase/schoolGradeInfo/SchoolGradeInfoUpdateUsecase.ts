import SchoolClass from "../../domain/model/schoolGradeInfo/schoolClass";
import SchoolGradeInfo from "../../domain/model/schoolGradeInfo/schoolGradeInfo";
import SchoolYear from "../../domain/model/schoolGradeInfo/schoolYear";
import {ISchoolGradeInfoDBRepository} from "../../domain/repository/db/ISchoolGradeInfoDBRepository";
import SchoolGradeInfoUpdateInputData from "../../presentation/dto/schoolGradeInfo/update/SchoolGradeInfoUpdateInputData";
import {Usecase} from "../Usecase";

export default class SchoolGradeInfoUpdateUsecase implements Usecase<SchoolGradeInfoUpdateInputData, Promise<void>> {
  private readonly schoolGradeInfoDB: ISchoolGradeInfoDBRepository;

  public constructor(schoolGradeInfoDB: ISchoolGradeInfoDBRepository) {
    this.schoolGradeInfoDB = schoolGradeInfoDB;
  }

  public async execute(input: SchoolGradeInfoUpdateInputData): Promise<void> {
    const schoolGradeInfo = new SchoolGradeInfo(
        new SchoolYear(input.schoolYear),
        new SchoolClass(input.schoolClass),
    );
    await this.schoolGradeInfoDB.update(schoolGradeInfo);
  }
}
