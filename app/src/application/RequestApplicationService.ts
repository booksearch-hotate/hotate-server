import {IRequestApplicationRepository} from './repository/IRequestApplicationRepository';
import RequestModel from '../domain/model/requestModel';

import RequestData from './dto/RequestData';

import RequestService from '../domain/service/requestService';

export default class RequestApplicationService {
  private requestRepository: IRequestApplicationRepository;
  private requestService: RequestService;

  constructor(requestRepository: IRequestApplicationRepository, requestService: RequestService) {
    this.requestRepository = requestRepository;
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
      schoolYear: string,
      schoolClass: string,
      userName: string,
  ) {
    const requestModel = new RequestModel(
        id,
        bookName,
        authorName,
        publisherName,
        isbn,
        message,
        departmentId,
        schoolYear,
        schoolClass,
        userName,
    );

    await this.requestRepository.register(requestModel);
  }

  public makeData(saveData: any): RequestData {
    if (typeof saveData !== 'object') throw new Error('The value could not be obtained correctly.');

    const keepReqObj = saveData.keepReqObj;

    const requestModel = new RequestModel(
        this.requestService.createUUID(),
        keepReqObj.bookName,
        keepReqObj.authorName,
        keepReqObj.publisherName,
        keepReqObj.isbn,
        keepReqObj.message,
        keepReqObj.departmentId,
        keepReqObj.schoolYear,
        keepReqObj.schoolClass,
        keepReqObj.userName,
    );
    return new RequestData(requestModel);
  }
}
