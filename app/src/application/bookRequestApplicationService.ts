import {IBookRequestRepository} from '../domain/model/bookRequest/IBookRequestRepository';
import {IDepartmentRepository} from '../domain/model/department/IDepartmentRepository';

import BookRequest from '../domain/model/bookRequest/bookRequest';
import Department from '../domain/model/department/department';

import BookRequestData from '../domain/model/bookRequest/bookRequestData';

import BookRequestService from '../domain/service/bookRequestService';
import {DomainInvalidError, FormInvalidError, InfrastructureError, InvalidDataTypeError} from '../presentation/error';

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
    const department = new Department(departmentId, departmentName);

    const requestModel = new BookRequest(
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
    if (typeof saveData !== 'object') throw new InvalidDataTypeError('saveDataの形式が不正です。');

    const keepReqObj = saveData.keepReqObj;

    const departmentId = keepReqObj.departmentId as string;

    const departmentModel = await this.deparmentRepository.findById(departmentId);

    if (departmentModel === null) throw new InfrastructureError('学科が見つかりませんでした。');

    try {
      const requestModel = new BookRequest(
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
    } catch (e) {
      if (e instanceof DomainInvalidError) throw new FormInvalidError('リクエストデータの形式が不正です。');

      throw e;
    }
  }

  public async delete(id: string): Promise<void> {
    await this.requestRepository.delete(id);
  }
}
