import BookRequest from "../../domain/model/bookRequest/bookRequest";
import BookRequestId from "../../domain/model/bookRequest/bookRequestId";
import SchoolClass from "../../domain/model/schoolGradeInfo/schoolClass";
import SchoolYear from "../../domain/model/schoolGradeInfo/schoolYear";
import {IBookRequestDBRepository} from "../../domain/repository/db/IBookRequestDBRepository";
import RequestSaveInputData from "../../presentation/dto/request/save/RequestSaveInputData";
import {Usecase} from "../Usecase";

export default class SaveRequestUsecase implements Usecase<RequestSaveInputData, Promise<void>> {
  private readonly requestDB: IBookRequestDBRepository;

  constructor(requestDB: IBookRequestDBRepository) {
    this.requestDB = requestDB;
  }

  public async execute(input: RequestSaveInputData): Promise<void> {
    const data = input.requestData;
    const request = new BookRequest(
        new BookRequestId(data.Id),
        data.BookName,
        data.AuthorName,
        data.PublisherName,
        data.Isbn,
        data.Message,
        data.Department,
        new SchoolYear(data.SchoolYear),
        new SchoolClass(data.SchoolClass),
        data.UserName,
        new Date(),
    );

    await this.requestDB.save(request);
  }
}
