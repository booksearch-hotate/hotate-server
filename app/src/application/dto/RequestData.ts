import RequestModel from '../../domain/model/requestModel';
import DepartmentModel from '../../domain/model/departmentModel';

export default class RequestData {
  private id: string;
  private bookName: string;
  private authorName: string;
  private publisherName: string;
  private isbn: string;
  private message: string;
  private department: DepartmentModel;
  private schoolYear: string;
  private schoolClass: string;
  private userName: string;
  private createAt: Date;

  public constructor(requestModel: RequestModel) {
    this.id = requestModel.Id;
    this.bookName = requestModel.BookName;
    this.authorName = requestModel.AuthorName;
    this.publisherName = requestModel.PublisherName;
    this.isbn = requestModel.Isbn;
    this.message = requestModel.Message;
    this.department = requestModel.Department;
    this.schoolYear = requestModel.SchoolYear;
    this.schoolClass = requestModel.SchoolClass;
    this.userName = requestModel.UserName;
    this.createAt = requestModel.CreatedAt;
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
  get Department(): DepartmentModel {
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
  get CreatedAt(): Date {
    return this.createAt;
  }
}
