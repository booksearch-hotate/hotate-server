import DepartmentId from "../../domain/model/department/departmentId";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentDeleteInputData from "../../presentation/dto/department/delete/DepartmentDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteDepartmentUsecase implements Usecase<DepartmentDeleteInputData, Promise<void>> {
  private readonly departmentDB: IDepartmentDBRepository;

  public constructor(departmentDB: IDepartmentDBRepository) {
    this.departmentDB = departmentDB;
  }

  public async execute(input: DepartmentDeleteInputData): Promise<void> {
    const department = await this.departmentDB.findById(new DepartmentId(input.id));

    if (department === null) throw new Error("学科が見つかりませんでした。");

    this.departmentDB.delete(department);
  }
}
