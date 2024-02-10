import Department from "../../domain/model/department/department";
import DepartmentId from "../../domain/model/department/departmentId";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentService from "../../domain/service/departmentService";
import DepartmentSaveInputData from "../../presentation/dto/department/save/DepartmentSaveInputData";
import {Usecase} from "../Usecase";

export default class SaveDepartmentUseCase implements Usecase<DepartmentSaveInputData, Promise<void>> {
  private readonly departmentDB: IDepartmentDBRepository;
  private readonly departmentService: DepartmentService;

  public constructor(departmentDB: IDepartmentDBRepository, departmentService: DepartmentService) {
    this.departmentDB = departmentDB;
    this.departmentService = departmentService;
  }

  public async execute(input: DepartmentSaveInputData): Promise<void> {
    const department = new Department(
        new DepartmentId(null),
        input.name,
    );

    if (await this.departmentService.isExist(department)) throw new Error("既に登録されている学科です。");

    await this.departmentDB.save(department);
  }
}
