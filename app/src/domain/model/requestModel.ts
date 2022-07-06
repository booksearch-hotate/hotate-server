export default class RequestModel {
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

  public constructor(
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
    if (userName.length === 0) throw new Error('User name is empty.');
    if (departmentId.length === 0) throw new Error('The id of the department does not exist.');
    if (schoolYear.length === 0) throw new Error('The grade does not exist.');
    if (schoolClass.length === 0) throw new Error('class does not exist.');

    this.id = id;
    this.bookName = bookName;
    this.authorName = authorName;
    this.publisherName = publisherName;
    this.isbn = isbn;
    this.message = message;
    this.departmentId = departmentId;
    this.schoolYear = schoolYear;
    this.schoolClass = schoolClass;
    this.userName = userName;
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