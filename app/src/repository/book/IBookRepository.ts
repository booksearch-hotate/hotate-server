import BookModel from "../../domain/model/bookModel"

export default interface IBookRepository {
  getMaximumId (): Promise<number>
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
}
