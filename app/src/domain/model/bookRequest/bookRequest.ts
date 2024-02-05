import Department from '../department/department';
import {DomainInvalidError} from '../../../presentation/error';

export default class BookRequest {
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
  private createdAt: Date;

  private readonly MAX_BOOK_NAME_LEN = 150;
  private readonly MAX_AUTHOR_NAME_LEN = 200;
  private readonly MAX_PUBLISHER_NAME_LEN = 200;
  private readonly MAX_MESSAGE_LEN = 500;
  private readonly MAX_USERNAME_LEN = 50;

  public constructor(
      id: string,
      bookName: string,
      authorName: string | null,
      publisherName: string | null,
      isbn: string | null,
      message: string | null,
      department: Department,
      schoolYear: string,
      schoolClass: string,
      userName: string,
      createdAt: Date | null = null,
  ) {
    if (authorName === null) authorName = '';
    if (publisherName === null) publisherName = '';
    if (isbn === null) isbn = '';
    if (message === null) message = '';

    if (bookName.length === 0 || bookName.length > this.MAX_BOOK_NAME_LEN) throw new DomainInvalidError(`The format of the name of book is different. Name of book: ${bookName}`);
    if (authorName.length > this.MAX_AUTHOR_NAME_LEN) throw new DomainInvalidError(`The format of the name of author is different. Name of author: ${authorName}`);
    if (publisherName.length > this.MAX_PUBLISHER_NAME_LEN) throw new DomainInvalidError(`The format of the name of publisher is different. Name of author: ${publisherName}`);
    if (message.length > this.MAX_MESSAGE_LEN) throw new DomainInvalidError(`The format of the message is different. Message: ${message}`);
    if (userName.length === 0 || userName.length > this.MAX_USERNAME_LEN) throw new DomainInvalidError(`The format of the name of user is different. Name of user: ${userName}`);

    if (schoolYear.length === 0) throw new DomainInvalidError('The grade does not exist.');
    if (schoolClass.length === 0) throw new DomainInvalidError('class does not exist.');

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
  get CreatedAt(): Date {
    return this.createdAt;
  }
}
