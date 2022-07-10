import {IRequestApplicationRepository} from './repository/IRequestApplicationRepository';
import {IDepartmentRepository} from './repository/IDepartmentApplicationRepository';

import RequestModel from '../domain/model/requestModel';
import DepartmentModel from '../domain/model/departmentModel';

import RequestData from './dto/requestData';

import RequestService from '../domain/service/requestService';

export default class RequestApplicationService {
  private requestRepository: IRequestApplicationRepository;
  private deparmentRepository: IDepartmentRepository;
  private requestService: RequestService;

  constructor(
      requestRepository: IRequestApplicationRepository,
      departmentRepository: IDepartmentRepository,
      requestService: RequestService,
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

    const requestModel = new RequestModel(
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

  public async findAll(): Promise<RequestData[]> {
    const requestModel = await this.requestRepository.findAll();

    if (requestModel === null) return [];

    return requestModel.map((item) => new RequestData(item));
  }

  public async findById(requestId: string): Promise<RequestData | null> {
    const requestModel = await this.requestRepository.findById(requestId);

    return requestModel === null ? null : new RequestData(requestModel);
  }

  public async makeData(saveData: any): Promise<RequestData> {
    if (typeof saveData !== 'object') throw new Error('The value could not be obtained correctly.');

    const keepReqObj = saveData.keepReqObj;

    const departmentId = keepReqObj.departmentId as string;

    const departmentModel = await this.deparmentRepository.findById(departmentId);

    if (departmentModel === null) throw new Error('The name of the department could not be obtained.');

    const requestModel = new RequestModel(
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
    return new RequestData(requestModel);
  }

  public async delete(id: string): Promise<void> {
    await this.requestRepository.delete(id);
  }
}
