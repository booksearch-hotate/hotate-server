import DepartmentConfirmDeleteInputData from "../../presentation/dto/department/confirmDelete/DepartmentConfirmDeleteInputData";
import DepartmentDeleteInputData from "../../presentation/dto/department/delete/DepartmentDeleteInputData";
import DepartmentFindByIdInputData from "../../presentation/dto/department/findById/DepartmentFindByIdInputData";
import DepartmentSaveInputData from "../../presentation/dto/department/save/DepartmentSaveInputData";
import DepartmentUpdateInputData from "../../presentation/dto/department/update/DepartmentUpdateInputData";
import SchoolGradeInfoUpdateInputData from "../../presentation/dto/schoolGradeInfo/update/SchoolGradeInfoUpdateInputData";
import DepartmentConfirmDeleteResponse from "../../presentation/response/department/DepartmentConfirmDeleteResponse";
import DepartmentDeleteResponse from "../../presentation/response/department/DepartmentDeleteResponse";
import DepartmentFetchResponse from "../../presentation/response/department/DepartmentFetchResponse";
import DepartmentFindByIdResponse from "../../presentation/response/department/DepartmentFindByIdResponse";
import DepartmentSaveResponse from "../../presentation/response/department/DepartmentSaveResponse";
import DepartmentUpdateResponse from "../../presentation/response/department/DepartmentUpdateResponse";
import SchoolGradeInfoUpdateResponse from "../../presentation/response/schoolGradeInfo/SchoolGradeInfoUpdateResponse";
import ConfirmDeleteDepartmentUseCase from "../../usecase/department/ConfirmDeleteDepartmentUsecase";
import DeleteDepartmentUsecase from "../../usecase/department/DeleteDepartmentUsecase";
import FindAllDepartmentUsecase from "../../usecase/department/FindAllDepartmentUsecase";
import FindByIdDepartmentUseCase from "../../usecase/department/FindByIdDepartmentUsecase";
import SaveDepartmentUseCase from "../../usecase/department/SaveDepartmentUsecase";
import UpdateDepartmentUsecase from "../../usecase/department/UpdateDepartmentUsecase";
import SchoolGradeInfoFindUseCase from "../../usecase/schoolGradeInfo/SchoolGradeInfoFindUsecase";
import SchoolGradeInfoUpdateUsecase from "../../usecase/schoolGradeInfo/SchoolGradeInfoUpdateUsecase";

export default class DepartmentAdminController {
  private readonly departmentFindAllUsecase: FindAllDepartmentUsecase;
  private readonly schoolGradeInfoFindUsecase: SchoolGradeInfoFindUseCase;

  private readonly schoolGradeInfoUpdateUsecase: SchoolGradeInfoUpdateUsecase;

  private readonly departmentSaveUsecase: SaveDepartmentUseCase;

  private readonly departmentConfirmDeleteUsecase: ConfirmDeleteDepartmentUseCase;

  private readonly departmentDeleteUsecase: DeleteDepartmentUsecase;

  private readonly departmentFindByIdUsecase: FindByIdDepartmentUseCase;

  private readonly departmentUpdateUsecase: UpdateDepartmentUsecase;

  public constructor(
      departmentFindAllUsecase: FindAllDepartmentUsecase,
      schoolGradeInfoFindUsecase: SchoolGradeInfoFindUseCase,
      schoolGradeInfoUpdateUsecase: SchoolGradeInfoUpdateUsecase,
      departmentSaveUsecase: SaveDepartmentUseCase,
      departmentConfirmDeleteUsecase: ConfirmDeleteDepartmentUseCase,
      departmentDeleteUsecase: DeleteDepartmentUsecase,
      departmentFindByIdUsecase: FindByIdDepartmentUseCase,
      departmentUpdateUsecase: UpdateDepartmentUsecase,
  ) {
    this.departmentFindAllUsecase = departmentFindAllUsecase;
    this.schoolGradeInfoFindUsecase = schoolGradeInfoFindUsecase;
    this.schoolGradeInfoUpdateUsecase = schoolGradeInfoUpdateUsecase;
    this.departmentSaveUsecase = departmentSaveUsecase;
    this.departmentConfirmDeleteUsecase = departmentConfirmDeleteUsecase;
    this.departmentDeleteUsecase = departmentDeleteUsecase;
    this.departmentFindByIdUsecase = departmentFindByIdUsecase;
    this.departmentUpdateUsecase = departmentUpdateUsecase;
  }

  public async fetch(): Promise<DepartmentFetchResponse> {
    const response = new DepartmentFetchResponse();

    try {
      const departmentOutput = await this.departmentFindAllUsecase.execute();
      const schoolGradeInfo = await this.schoolGradeInfoFindUsecase.execute();

      return response.success({
        departments: departmentOutput,
        schoolGradeInfo: schoolGradeInfo,
      });
    } catch (e) {
      return response.error();
    }
  }

  public async updateSchoolGradeInfo(schoolYear: string, schoolClass: string): Promise<SchoolGradeInfoUpdateResponse> {
    const response = new SchoolGradeInfoUpdateResponse();

    try {
      const input = new SchoolGradeInfoUpdateInputData(Number(schoolYear), Number(schoolClass));

      await this.schoolGradeInfoUpdateUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async saveDepartment(name: string): Promise<DepartmentSaveResponse> {
    const response = new DepartmentSaveResponse();
    try {
      const input = new DepartmentSaveInputData(name);

      await this.departmentSaveUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async confirmDelete(id: string): Promise<DepartmentConfirmDeleteResponse> {
    const response = new DepartmentConfirmDeleteResponse();

    try {
      const input = new DepartmentConfirmDeleteInputData(id);

      const output = await this.departmentConfirmDeleteUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async deleteDepartment(id: string): Promise<DepartmentDeleteResponse> {
    const response = new DepartmentDeleteResponse();

    try {
      const input = new DepartmentDeleteInputData(id);

      await this.departmentDeleteUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async findById(id: string): Promise<DepartmentFindByIdResponse> {
    const response = new DepartmentFindByIdResponse();

    try {
      const input = new DepartmentFindByIdInputData(id);
      const output = await this.departmentFindByIdUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async update(id: string, name: string): Promise<DepartmentUpdateResponse> {
    const response = new DepartmentUpdateResponse();

    try {
      const input = new DepartmentUpdateInputData(id, name);

      await this.departmentUpdateUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
