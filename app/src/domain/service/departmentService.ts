import {v4 as uuidv4} from "uuid";

import Department from "../model/department/department";

import {IDepartmentDBRepository} from "../repository/db/IDepartmentDBRepository";

export default class DepartmentService {
  private readonly departmentRepository: IDepartmentDBRepository;

  private readonly MAX_DEPARTMENT_COUNT = 20;

  public constructor(departmentRepository: IDepartmentDBRepository) {
    this.departmentRepository = departmentRepository;
  }

  public createUUID(): string {
    return uuidv4();
  }

  /**
   * 同じ名前の学科が存在するかを取得します
   * @param department 学科オブジェクト
   * @returns 存在するか
   */
  public async isExist(department: Department): Promise<boolean> {
    const found = await this.departmentRepository.findByName(department.Name);

    return found !== null;
  }

  public async isOverNumberOfDepartment(): Promise<boolean> {
    const departmentNum = await this.departmentRepository.count();
    return departmentNum > this.MAX_DEPARTMENT_COUNT;
  }

  public async isSameMaxDepartmentCount(): Promise<boolean> {
    const departmentNum = await this.departmentRepository.count();
    return departmentNum === this.MAX_DEPARTMENT_COUNT;
  }
}
