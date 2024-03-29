import BookRequest from "./bookRequest";
import Department from "../department/department";
import {conversionDateToString} from "../../../utils/conversionDate";

export default class BookRequestData {
  private id: string;
  private bookName: string;
  private authorName: string;
  private publisherName: string;
  private isbn: string;
  private message: string;
  private department: Department;
  private schoolYear: string;
  private schoolClass: string;
  private userName: string;
  private createAt: string;
  private studentInfo: string;

  public constructor(requestModel: BookRequest) {
    this.id = requestModel.Id.Id;
    this.bookName = requestModel.BookName;
    this.authorName = requestModel.AuthorName;
    this.publisherName = requestModel.PublisherName;
    this.isbn = requestModel.Isbn;
    this.message = requestModel.Message;
    this.department = requestModel.Department;
    this.schoolYear = String(requestModel.SchoolYear.Year);
    this.schoolClass = String(requestModel.SchoolClass.SchoolClass);
    this.userName = requestModel.UserName;
    this.createAt = conversionDateToString(requestModel.CreatedAt);
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
  get SchoolYear(): string {
    return this.schoolYear;
  }
  get SchoolClass(): string {
    return this.schoolClass;
  }
  get UserName(): string {
    return this.userName;
  }
  get CreatedAt(): string {
    return this.createAt;
  }
  get StudentInfo(): string {
    return this.studentInfo;
  }
}
