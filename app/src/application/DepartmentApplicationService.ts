import DepartmentModel from '../domain/model/departmentModel';

import DepartmentService from '../domain/service/departmentService';

import DepartmentData from './dto/DepartmentData';

import {IDepartmentRepository} from './repository/IDepartmentApplicationRepository';

export default class DepartmentApplicationService {
  private readonly departmentRepository: IDepartmentRepository;
  private readonly departmentService: DepartmentService;

  private readonly MAX_DEPARTMENT_COUNT = 20;

  public constructor(bookRequestRepository: IDepartmentRepository, departmentService: DepartmentService) {
    this.departmentRepository = bookRequestRepository;
    this.departmentService = departmentService;
  }

  /**
   * 登録されている学科をすべて取得します。
   * @returns {Promise<DepartmentModel[]>} 登録されている全学科の項目
   */
  public async findAllDepartment(): Promise<DepartmentData[]> {
    const fetchModel = await this.departmentRepository.findAllDepartment();

    const res: DepartmentData[] = [];

    for (const model of fetchModel) res.push(new DepartmentData(model));

    return res;
  }

  public async isMax(): Promise<boolean> {
    const count = await this.departmentRepository.count();

    return this.MAX_DEPARTMENT_COUNT >= count;
  }

  public async insertDepartment(name: string): Promise<boolean> {
    const department = new DepartmentModel(this.departmentService.createUUID(), name);
    const isExist = await this.departmentService.isExist(department);

    if (isExist) return false;

    if (await this.isMax()) throw new Error('The number of department names that can be registered is exceeded.');

    await this.departmentRepository.insertDepartment(department);

    return true;
  }
}