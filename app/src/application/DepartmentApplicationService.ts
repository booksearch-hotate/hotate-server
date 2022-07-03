import DepartmentData from './dto/DepartmentData';

import {IDepartmentRepository} from './repository/IDepartmentApplicationRepository';

export default class DepartmentApplicationService {
  private readonly departmentRepository: IDepartmentRepository;

  public constructor(bookRequestRepository: IDepartmentRepository) {
    this.departmentRepository = bookRequestRepository;
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
}
