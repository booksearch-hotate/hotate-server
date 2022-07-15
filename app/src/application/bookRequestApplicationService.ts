import {IBookRequestRepository} from '../domain/model/bookRequest/IBookRequestRepository';
import {IDepartmentRepository} from '../domain/model/department/IDepartmentRepository';

import BookRequestModel from '../domain/model/bookRequest/bookRequestModel';
import DepartmentModel from '../domain/model/department/departmentModel';

import BookRequestData from '../domain/model/bookRequest/bookRequestData';

import BookRequestService from '../domain/service/bookRequestService';

export default class BookRequestApplicationService {
  private requestRepository: IBookRequestRepository;
  private deparmentRepository: IDepartmentRepository;
  private requestService: BookRequestService;

  constructor(
      requestRepository: IBookRequestRepository,
      departmentRepository: IDepartmentRepository,
      requestService: BookRequestService,
  ) {
    this.requestRepository = requestRepository;
    this.deparmentRepository = departmentRepository;
    this.requestService = requestService;
  }

  public async register(
      id: string,
      bookName: string,
      authorName: string,
      publisherName: string,
      isbn: string,
      message: string,
      departmentId: string,
      departmentName: string,
      schoolYear: string,
      schoolClass: string,
      userName: string,
  ) {
    const department = new DepartmentModel(departmentId, departmentName);

    const requestModel = new BookRequestModel(
        id,
        bookName,
        authorName,
        publisherName,
        isbn,
        message,
        department,
        schoolYear,
        schoolClass,
        userName,
    );

    await this.requestRepository.register(requestModel);
  }

  public async findAll(): Promise<BookRequestData[]> {
    const requestModel = await this.requestRepository.findAll();

    if (requestModel === null) return [];

    return requestModel.map((item) => new BookRequestData(item));
  }

  public async findById(requestId: string): Promise<BookRequestData | null> {
    const requestModel = await this.requestRepository.findById(requestId);

    return requestModel === null ? null : new BookRequestData(requestModel);
  }

  public async makeData(saveData: any): Promise<BookRequestData> {
    if (typeof saveData !== 'object') throw new Error('The value could not be obtained correctly.');

    const keepReqObj = saveData.keepReqObj;

    const departmentId = keepReqObj.departmentId as string;

    const departmentModel = await this.deparmentRepository.findById(departmentId);

    if (departmentModel === null) throw new Error('The name of the department could not be obtained.');

    const requestModel = new BookRequestModel(
        this.requestService.createUUID(),
        keepReqObj.bookName,
        keepReqObj.authorName,
        keepReqObj.publisherName,
        keepReqObj.isbn,
        keepReqObj.message,
        departmentModel,
        keepReqObj.schoolYear,
        keepReqObj.schoolClass,
        keepReqObj.userName,
    );
    return new BookRequestData(requestModel);
  }

  public async delete(id: string): Promise<void> {
    await this.requestRepository.delete(id);
  }
}