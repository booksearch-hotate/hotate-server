import DepartmentId from "../../../../domain/model/department/departmentId";
import SchoolClass from "../../../../domain/model/schoolGradeInfo/schoolClass";
import SchoolYear from "../../../../domain/model/schoolGradeInfo/schoolYear";

export default class RequestMakeInputData {
  public bookName: string;
  public authorName: string;
  public publisherName: string;
  public isbn: string;
  public message: string;
  public departmentId: DepartmentId;
  public schoolYear: SchoolYear;
  public schoolClass: SchoolClass;
  public userName: string;

  public constructor(
      bookName: string,
      authorName: string,
      publisherName: string,
      isbn: string,
      message: string,
      departmentId: string,
      schoolYear: number,
      schoolClass: number,
      userName: string,
  ) {
    this.bookName = bookName;
    this.authorName = authorName;
    this.publisherName = publisherName;
    this.isbn = isbn;
    this.message = message;
    this.departmentId = new DepartmentId(departmentId);
    this.schoolYear = new SchoolYear(schoolYear);
    this.schoolClass = new SchoolClass(schoolClass);
    this.userName = userName;
  }
}
