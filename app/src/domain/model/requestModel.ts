import DepartmentModel from './departmentModel';

export default class RequestModel {
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
  private createdAt: Date;

  public constructor(
      id: string,
      bookName: string,
      authorName: string,
      publisherName: string,
      isbn: string,
      message: string,
      department: DepartmentModel,
      schoolYear: string,
      schoolClass: string,
      userName: string,
      createdAt: Date | null = null,
  ) {
    if (bookName.length === 0) throw new Error('Name of book is empty.');
    if (userName.length === 0) throw new Error('User name is empty.');
    if (schoolYear.length === 0) throw new Error('The grade does not exist.');
    if (schoolClass.length === 0) throw new Error('class does not exist.');

    this.id = id;
    this.bookName = bookName;
    this.authorName = authorName;
    this.publisherName = publisherName;
    this.isbn = isbn;
    this.message = message;
    this.department = department;
    this.schoolYear = schoolYear;
    this.schoolClass = schoolClass;
    this.userName = userName;
    this.createdAt = createdAt === null ? new Date() : createdAt;
  }

  public makeStudentInfo(): string {
    return `${this.SchoolYear}年 ${this.department.Name}科 ${this.SchoolClass}組`;
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
    return this.createdAt;
  }
}
