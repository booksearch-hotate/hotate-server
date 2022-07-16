import {v4 as uuidv4} from 'uuid';

import DepartmentModel from '../model/department/departmentModel';

import {IDepartmentRepository} from '../model/department/IDepartmentRepository';

export default class DepartmentService {
  private readonly departmentRepository: IDepartmentRepository;

  private readonly MAX_DEPARTMENT_COUNT = 20;

  public constructor(departmentRepository: IDepartmentRepository) {
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
  public async isExist(department: DepartmentModel): Promise<boolean> {
    const found = await this.departmentRepository.findByName(department.Name);

    return found !== null;
  }

  public async isOverNumberOfDepartment(): Promise<boolean> {
    const departmentNum = await this.departmentRepository.count();
    return departmentNum > this.MAX_DEPARTMENT_COUNT;
  }
}
