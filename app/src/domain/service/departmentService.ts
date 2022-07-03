import {v4 as uuidv4} from 'uuid';

import DepartmentModel from '../model/departmentModel';

import {IDepartmentDomainRepository} from './repository/IDepartmentDomainRepository';

export default class DepartmentService {
  private readonly departmentRepository: IDepartmentDomainRepository;

  public constructor(departmentRepository: IDepartmentDomainRepository) {
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
}
