import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import {ISchoolGradeInfoDBRepository} from "../../domain/repository/db/ISchoolGradeInfoDBRepository";
import RequestSetOutputData from "../../presentation/dto/request/setForm/RequestSetOutputData";
import {Usecase} from "../Usecase";

export default class SetRequestUseCase implements Usecase<void, Promise<RequestSetOutputData>> {
  private schoolGradeInfoDB: ISchoolGradeInfoDBRepository;
  private departmentDB: IDepartmentDBRepository;

  public constructor(
      schoolGradeInfoDB: ISchoolGradeInfoDBRepository,
      departmentDB: IDepartmentDBRepository,
  ) {
    this.schoolGradeInfoDB = schoolGradeInfoDB;
    this.departmentDB = departmentDB;
  }

  public async execute(): Promise<RequestSetOutputData> {
    const departmentList = await this.departmentDB.findAll();
    const schoolGradeInfo = await this.schoolGradeInfoDB.find();

    if (schoolGradeInfo === null) throw new Error("学年情報が見つかりませんでした");

    return new RequestSetOutputData(departmentList, schoolGradeInfo);
  }
}
