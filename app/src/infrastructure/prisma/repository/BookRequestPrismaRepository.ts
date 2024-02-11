import {PrismaClient} from "@prisma/client";
import BookRequest from "../../../domain/model/bookRequest/bookRequest";
import {IBookRequestDBRepository} from "../../../domain/repository/db/IBookRequestDBRepository";
import BookRequestId from "../../../domain/model/bookRequest/bookRequestId";
import Department from "../../../domain/model/department/department";
import DepartmentId from "../../../domain/model/department/departmentId";
import SchoolYear from "../../../domain/model/schoolGradeInfo/schoolYear";
import SchoolClass from "../../../domain/model/schoolGradeInfo/schoolClass";

export default class BookRequestPrismaRepository implements IBookRequestDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async save(request: BookRequest): Promise<void> {
    await this.db.requests.create({
      data: {
        id: request.Id.Id,
        book_name: request.BookName,
        author_name: request.AuthorName,
        publisher_name: request.PublisherName,
        isbn: request.Isbn,
        message: request.Message,
        department_id: request.Department.Id.Id,
        school_year: String(request.SchoolYear.Year),
        school_class: String(request.SchoolClass.SchoolClass),
        user_name: request.UserName,
        created_at: request.CreatedAt,
      },
    });
  }

  public async findById(id: BookRequestId): Promise<BookRequest | null> {
    const request = await this.db.requests.findFirst({
      where: {
        id: id.Id,
      },
      include: {
        departments: true,
      },
    });

    if (request === null) return null;

    return new BookRequest(
        new BookRequestId(request.id),
        request.book_name,
        request.author_name,
        request.publisher_name,
        request.isbn,
        request.message,
        new Department(new DepartmentId(request.departments.id), request.departments.name),
        new SchoolYear(Number(request.school_year)),
        new SchoolClass(Number(request.school_class)),
        request.user_name,
        request.created_at,
    );
  }

  public async fetchAll(): Promise<BookRequest[]> {
    const requests = await this.db.requests.findMany({
      include: {
        departments: true,
      },
    });

    return requests.map((request) => new BookRequest(
        new BookRequestId(request.id),
        request.book_name,
        request.author_name,
        request.publisher_name,
        request.isbn,
        request.message,
        new Department(new DepartmentId(request.departments.id), request.departments.name),
        new SchoolYear(Number(request.school_year)),
        new SchoolClass(Number(request.school_class)),
        request.user_name,
        request.created_at,
    ));
  }

  public async delete(request: BookRequest): Promise<void> {
    await this.db.requests.delete({
      where: {
        id: request.Id.Id,
      },
    });
  }

  public async findByDepartmentId(departmentId: DepartmentId): Promise<BookRequest[]> {
    const requests = await this.db.requests.findMany({
      where: {
        department_id: departmentId.Id,
      },
      include: {
        departments: true,
      },
    });

    return requests.map((request) => new BookRequest(
        new BookRequestId(request.id),
        request.book_name,
        request.author_name,
        request.publisher_name,
        request.isbn,
        request.message,
        new Department(new DepartmentId(request.departments.id), request.departments.name),
        new SchoolYear(Number(request.school_year)),
        new SchoolClass(Number(request.school_class)),
        request.user_name,
        request.created_at,
    ));
  }
}
