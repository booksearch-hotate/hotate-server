import BookRequest from '../model/bookRequest/bookRequest';

export interface IBookRequestRepository {
  register(request: BookRequest): Promise<void>
  delete(id: string): Promise<void>
  findAll(): Promise<BookRequest[] | null>
  findById(requestId: string): Promise<BookRequest | null>
  findByDepartmendId(departmentId: string): Promise<BookRequest[]>
}
