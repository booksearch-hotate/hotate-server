import DepartmentId from "../../domain/model/department/departmentId";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentFindByIdInputData from "../../presentation/dto/department/findById/DepartmentFindByIdInputData";
import DepartmentFindByIdOutputData from "../../presentation/dto/department/findById/DepartmentFindByIdOutputData";
import {Usecase} from "../Usecase";

export default class FindByIdDepartmentUseCase implements Usecase<DepartmentFindByIdInputData, Promise<DepartmentFindByIdOutputData>> {
  private departmentDB: IDepartmentDBRepository;

  public constructor(departmentDB: IDepartmentDBRepository) {
    this.departmentDB = departmentDB;
  }

  public async execute(input: DepartmentFindByIdInputData): Promise<DepartmentFindByIdOutputData> {
    const department = await this.departmentDB.findById(new DepartmentId(input.id));

    if (department === null) throw new Error("学科が見つかりませんでした。");

    return new DepartmentFindByIdOutputData(department);
  }
}
