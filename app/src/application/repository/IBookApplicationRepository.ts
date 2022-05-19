import BookModel from '../../domain/model/bookModel';

export interface IBookApplicationRepository {
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
  search (query: string): Promise<BookModel[]>
}
