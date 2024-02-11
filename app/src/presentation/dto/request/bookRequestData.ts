import BookRequest from "../../../domain/model/bookRequest/bookRequest";
import Department from "../../../domain/model/department/department";
import {conversionDateToString} from "../../../utils/conversionDate";

export default class BookRequestData {
  private id: string;
  private bookName: string;
  private authorName: string;
  private publisherName: string;
  private isbn: string;
  private message: string;
  private department: Department;
  private schoolYear: number;
  private schoolClass: number;
  private userName: string;
  private createdAt: string;
  private studentInfo: string;

  public constructor(requestModel: BookRequest) {
    this.id = requestModel.Id.Id;
    this.bookName = requestModel.BookName;
    this.authorName = requestModel.AuthorName;
    this.publisherName = requestModel.PublisherName;
    this.isbn = requestModel.Isbn;
    this.message = requestModel.Message;
    this.department = requestModel.Department;
    this.schoolYear = requestModel.SchoolYear.Year;
    this.schoolClass = requestModel.SchoolClass.SchoolClass;
    this.userName = requestModel.UserName;
    this.createdAt = conversionDateToString(requestModel.CreatedAt);
    this.studentInfo = requestModel.makeStudentInfo();
  }

  get Id(): string {
    return this.id;
  }
  get BookName(): string {
    return this.bookName;
  }
  get AuthorName(): string {
    return this.authorName;
  }
  get PublisherName(): string {
    return this.publisherName;
  }
  get Isbn(): string {
    return this.isbn;
  }
  get Message(): string {
    return this.message;
  }
  get Department(): Department {
    return this.department;
  }
  get SchoolYear(): number {
    return this.schoolYear;
  }
  get SchoolClass(): number {
    return this.schoolClass;
  }
  get UserName(): string {
    return this.userName;
  }
  get CreatedAt(): string {
    return this.createdAt;
  }
  get StudentInfo(): string {
    return this.studentInfo;
  }
}
