import {ISchoolGradeInfoDBRepository} from "../../domain/repository/db/ISchoolGradeInfoDBRepository";
import SchoolGradeInfoFindOutputData from "../../presentation/dto/schoolGradeInfo/find/SchoolGradeInfoFindOutputData";
import {Usecase} from "../Usecase";

export default class SchoolGradeInfoFindUseCase implements Usecase<void, Promise<SchoolGradeInfoFindOutputData>> {
  private readonly schoolGradeInfoDB: ISchoolGradeInfoDBRepository;

  public constructor(schoolGradeInfoDB: ISchoolGradeInfoDBRepository) {
    this.schoolGradeInfoDB = schoolGradeInfoDB;
  }

  public async execute(input: void): Promise<SchoolGradeInfoFindOutputData> {
    const schoolGradeInfo = await this.schoolGradeInfoDB.find();

    if (schoolGradeInfo === null) throw new Error("学年・学科情報が見つかりませんでした。");

    return new SchoolGradeInfoFindOutputData(schoolGradeInfo);
  }
}
