import Department from '../domain/model/department/department';

import DepartmentService from '../domain/service/departmentService';

import DepartmentData from '../domain/model/department/departmentData';

import {IDepartmentRepository} from '../domain/repository/IDepartmentRepository';
import {IBookRequestRepository} from '../domain/repository/IBookRequestRepository';
import BookRequestData from '../domain/model/bookRequest/bookRequestData';
import {OverflowDataError} from '../presentation/error';

export default class DepartmentApplicationService {
  private readonly departmentRepository: IDepartmentRepository;
  private readonly bookRequestRepository: IBookRequestRepository;
  private readonly departmentService: DepartmentService;

  public constructor(
      departmentRepository: IDepartmentRepository,
      bookRequestRepository: IBookRequestRepository,
      departmentService: DepartmentService,
  ) {
    this.departmentRepository = departmentRepository;
    this.bookRequestRepository = bookRequestRepository;
    this.departmentService = departmentService;
  }

  /**
   * 登録されている学科をすべて取得します
   * @returns {Promise<Department[]>} 登録されている全学科の項目
   */
  public async findAllDepartment(): Promise<DepartmentData[]> {
    const fetchModel = await this.departmentRepository.findAllDepartment();

    const res: DepartmentData[] = [];

    for (const model of fetchModel) res.push(new DepartmentData(model));

    return res;
  }

  /**
   * 現在登録している数が最大の個数かを取得します
   * @returns {boolean} 現在登録している数が最大の個数か
   */
  public async isMax(): Promise<boolean> {
    return await this.departmentService.isOverNumberOfDepartment();
  }

  /**
   * 学科名を追加します。なお重複する場合は追加せずにfalseを返します
   * @param name 追加する学科名
   * @returns 追加できたか
   */
  public async insertDepartment(name: string): Promise<boolean> {
    const department = new Department(this.departmentService.createUUID(), name);
    const isExist = await this.departmentService.isExist(department);

    if (isExist) return false;

    if (await this.isMax()) throw new OverflowDataError('The number of department names that can be registered is exceeded.');

    await this.departmentRepository.insertDepartment(department);

    return true;
  }

  public async deleteDepartment(id: string): Promise<void> {
    const bookRequestsHaveId = await this.bookRequestRepository.findByDepartmendId(id);

    const deleteBookRequests = bookRequestsHaveId.map(async (bookRequest) => {
      await this.bookRequestRepository.delete(bookRequest.Id);
    });

    await Promise.all(deleteBookRequests);
    await this.departmentRepository.deleteDepartment(id);
  }

  public async findById(id: string): Promise<DepartmentData | null> {
    const fetchModel = await this.departmentRepository.findById(id);

    if (fetchModel === null) return null;

    return new DepartmentData(fetchModel);
  }

  public async update(id: string, name: string): Promise<void> {
    const updateModel = new Department(id, name);
    await this.departmentRepository.update(updateModel);
  }

  public async findBookRequestById(departmentId: string): Promise<BookRequestData[]> {
    const fetchBookRequest = await this.bookRequestRepository.findByDepartmendId(departmentId);
    return fetchBookRequest.map((bookRequest) => new BookRequestData(bookRequest));
  }
}
