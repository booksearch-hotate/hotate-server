import {IRequestApplicationRepository} from './repository/IRequestApplicationRepository';
import RequestModel from '../domain/model/requestModel';

import RequestService from '../domain/service/requestService';

export default class RequestApplicationService {
  private requestRepository: IRequestApplicationRepository;
  private requestService: RequestService;

  constructor(requestRepository: IRequestApplicationRepository, requestService: RequestService) {
    this.requestRepository = requestRepository;
    this.requestService = requestService;
  }

  public async register(
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
        this.requestService.createUUID(),
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
}
