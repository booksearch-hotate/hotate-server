import DepartmentId from "../../domain/model/department/departmentId";
import {IBookRequestDBRepository} from "../../domain/repository/db/IBookRequestDBRepository";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import DepartmentConfirmDeleteInputData from "../../presentation/dto/department/confirmDelete/DepartmentConfirmDeleteInputData";
import DepartmentConfirmDeleteOutputData from "../../presentation/dto/department/confirmDelete/DepartmentConfirmDeleteOutputData";
import {Usecase} from "../Usecase";

export default class ConfirmDeleteDepartmentUseCase implements Usecase<DepartmentConfirmDeleteInputData, Promise<DepartmentConfirmDeleteOutputData>> {
  private readonly departmentDB: IDepartmentDBRepository;
  private readonly bookRequestDB: IBookRequestDBRepository;

  public constructor(departmentDB: IDepartmentDBRepository, bookRequestDB: IBookRequestDBRepository) {
    this.departmentDB = departmentDB;
    this.bookRequestDB = bookRequestDB;
  }

  public async execute(input: DepartmentConfirmDeleteInputData): Promise<DepartmentConfirmDeleteOutputData> {
    const department = await this.departmentDB.findById(new DepartmentId(input.id));
    if (department === null) throw new Error("Department not found");

    const requests = await this.bookRequestDB.findByDepartmentId(new DepartmentId(input.id));

    return new DepartmentConfirmDeleteOutputData(department, requests);
  }
}
