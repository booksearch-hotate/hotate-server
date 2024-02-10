import BookRequest from "../../model/bookRequest/bookRequest";
import BookRequestId from "../../model/bookRequest/bookRequestId";
import DepartmentId from "../../model/department/departmentId";

export interface IBookRequestDBRepository {
  save(request: BookRequest): Promise<void>
  fetchAll(): Promise<BookRequest[]>
  findById(id: BookRequestId): Promise<BookRequest | null>
  delete(request: BookRequest): Promise<void>
  findByDepartmentId(departmentId: DepartmentId): Promise<BookRequest[]>
}
