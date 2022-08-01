import BookRequest from './bookRequest';

export interface IBookRequestRepository {
  register(request: BookRequest): Promise<void>
  delete(id: string): Promise<void>
  findAll(): Promise<BookRequest[] | null>
  findById(requestId: string): Promise<BookRequest | null>
}
