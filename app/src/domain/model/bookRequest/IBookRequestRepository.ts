import BookRequestModel from './bookRequestModel';

export interface IBookRequestRepository {
  register(request: BookRequestModel): Promise<void>
  delete(id: string): Promise<void>
  findAll(): Promise<BookRequestModel[] | null>
  findById(requestId: string): Promise<BookRequestModel | null>
}
