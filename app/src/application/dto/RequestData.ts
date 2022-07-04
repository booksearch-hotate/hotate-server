import RequestModel from '../../domain/model/requestModel';

export default class RequestData {
  private id: string;
  private bookName: string;
  private authorName: string;
  private publisherName: string;
  private isbn: string;
  private message: string;
  private departmentId: string;
  private schoolYear: string;
  private schoolClass: string;
  private userName: string;

  public constructor(requestModel: RequestModel) {
    this.id = requestModel.Id;
    this.bookName = requestModel.BookName;
    this.authorName = requestModel.AuthorName;
    this.publisherName = requestModel.PublisherName;
    this.isbn = requestModel.Isbn;
    this.message = requestModel.Message;
    this.departmentId = requestModel.DepartmentId;
    this.schoolYear = requestModel.SchoolYear;
    this.schoolClass = requestModel.SchoolClass;
    this.userName = requestModel.UserName;
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
  get DepartmentId(): string {
    return this.departmentId;
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
}
