import Department from "../department/department";
import {DomainInvalidError} from "../../../presentation/error";
import BookRequestId from "./bookRequestId";
import SchoolYear from "../schoolGradeInfo/schoolYear";
import SchoolClass from "../schoolGradeInfo/schoolClass";

export default class BookRequest {
  private id: BookRequestId;
  private bookName: string;
  private authorName: string;
  private publisherName: string;
  private isbn: string;
  private message: string;
  private department: Department;
  private schoolYear: SchoolYear;
  private schoolClass: SchoolClass;
  private userName: string;
  private createdAt: Date;

  private readonly MAX_BOOK_NAME_LEN = 150;
  private readonly MAX_AUTHOR_NAME_LEN = 200;
  private readonly MAX_PUBLISHER_NAME_LEN = 200;
  private readonly MAX_MESSAGE_LEN = 500;
  private readonly MAX_USERNAME_LEN = 50;

  public constructor(
      id: BookRequestId,
      bookName: string,
      authorName: string | null,
      publisherName: string | null,
      isbn: string | null,
      message: string | null,
      department: Department,
      schoolYear: SchoolYear,
      schoolClass: SchoolClass,
      userName: string,
      createdAt: Date | null = null,
  ) {
    if (authorName === null) authorName = "";
    if (publisherName === null) publisherName = "";
    if (isbn === null) isbn = "";
    if (message === null) message = "";

    if (bookName.length === 0 || bookName.length > this.MAX_BOOK_NAME_LEN) throw new DomainInvalidError(`書名の文字数は1文字以上${this.MAX_BOOK_NAME_LEN}文字未満にしてください。`);
    if (authorName.length > this.MAX_AUTHOR_NAME_LEN) throw new DomainInvalidError(`著者の名前は最大${this.MAX_AUTHOR_NAME_LEN}文字までです。`);
    if (publisherName.length > this.MAX_PUBLISHER_NAME_LEN) throw new DomainInvalidError(`出版社の名前は最大${this.MAX_PUBLISHER_NAME_LEN}文字までです。`);
    if (message.length > this.MAX_MESSAGE_LEN) throw new DomainInvalidError(`メッセージは最大${this.MAX_MESSAGE_LEN}文字までです。`);
    if (userName.length === 0 || userName.length > this.MAX_USERNAME_LEN) throw new DomainInvalidError(`ユーザー名の文字数は1文字以上${this.MAX_USERNAME_LEN}文字未満にしてください。`);

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
    return `${this.SchoolYear.Year}年 ${this.department.Name}科 ${this.SchoolClass.SchoolClass}組`;
  }

  get Id(): BookRequestId {
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
  get SchoolYear(): SchoolYear {
    return this.schoolYear;
  }
  get SchoolClass(): SchoolClass {
    return this.schoolClass;
  }
  get UserName(): string {
    return this.userName;
  }
  get CreatedAt(): Date {
    return this.createdAt;
  }
}
