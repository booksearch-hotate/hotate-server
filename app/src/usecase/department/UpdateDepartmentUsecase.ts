import DepartmentId from "../../domain/model/department/departmentId";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentService from "../../domain/service/departmentService";
import DepartmentUpdateInputData from "../../presentation/dto/department/update/DepartmentUpdateInputData";
import {Usecase} from "../Usecase";

export default class UpdateDepartmentUsecase implements Usecase<DepartmentUpdateInputData, Promise<void>> {
  private readonly departmentDB: IDepartmentDBRepository;
  private readonly departmentService: DepartmentService;

  public constructor(departmentDB: IDepartmentDBRepository, departmentService: DepartmentService) {
    this.departmentDB = departmentDB;
    this.departmentService = departmentService;
  }

  public async execute(input: DepartmentUpdateInputData): Promise<void> {
    const department = await this.departmentDB.findById(new DepartmentId(input.id));

    if (department === null) throw new Error("学科が見つかりませんでした。");

    department.changeName(input.name);

    if (await this.departmentService.isExist(department)) throw new Error("学科名が重複しています。");

    await this.departmentDB.update(department);
  }
}
