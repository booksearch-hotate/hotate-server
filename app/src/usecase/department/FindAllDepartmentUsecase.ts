import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentService from "../../domain/service/departmentService";
import DepartmentFindAllInputData from "../../presentation/dto/department/findAll/DepartmentFindAllOutputData";
import {Usecase} from "../Usecase";

export default class FindAllDepartmentUsecase implements Usecase<void, Promise<DepartmentFindAllInputData>> {
  private departmentDB: IDepartmentDBRepository;
  private departmentService: DepartmentService;

  public constructor(departmentDB: IDepartmentDBRepository, departmentService: DepartmentService) {
    this.departmentDB = departmentDB;
    this.departmentService = departmentService;
  }

  public async execute(input: void): Promise<DepartmentFindAllInputData> {
    const departments = await this.departmentDB.findAll();
    const isMax = await this.departmentService.isSameMaxDepartmentCount();

    return new DepartmentFindAllInputData(departments, isMax);
  }
}
