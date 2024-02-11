import BookRequest from "../../domain/model/bookRequest/bookRequest";
import BookRequestId from "../../domain/model/bookRequest/bookRequestId";
import {IDepartmentDBRepository} from "../../domain/repository/db/IDepartmentDBRepository";
import RequestMakeInputData from "../../presentation/dto/request/makeRequestData/RequestMakeInputData";
import RequestMakeOutputData from "../../presentation/dto/request/makeRequestData/RequestMakeOutputData";
import {Usecase} from "../Usecase";

export default class MakeRequestDataUsecase implements Usecase<RequestMakeInputData, Promise<RequestMakeOutputData>> {
  private readonly departmentDB: IDepartmentDBRepository;

  public constructor(departmentDB: IDepartmentDBRepository) {
    this.departmentDB = departmentDB;
  }

  public async execute(input: RequestMakeInputData): Promise<RequestMakeOutputData> {
    const department = await this.departmentDB.findById(input.departmentId);

    if (department === null) throw new Error("The department does not exist.");

    const request = new BookRequest(
        new BookRequestId(null),
        input.bookName,
        input.authorName,
        input.publisherName,
        input.isbn,
        input.message,
        department,
        input.schoolYear,
        input.schoolClass,
        input.userName,
        new Date(),
    );

    return new RequestMakeOutputData(request);
  }
}
