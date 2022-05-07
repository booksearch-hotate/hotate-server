import IBookApplicationRepository from "./repository/IBookApplicationRepository"
import BookModel from "../domain/model/bookModel"
import AuthorModel from "../domain/model/authorModel"
import PublisherModel from "../domain/model/publisherModel"
import BookService from "../domain/service/bookService"

export default class BookApplicationService {
  private readonly bookRepository: IBookApplicationRepository
  private readonly bookService: BookService

  public constructor (bookRepository: IBookApplicationRepository) {
    this.bookRepository = bookRepository
    this.bookService = new BookService()
  }

  public async createBook (
    bookName: string,
    subName: string | null,
    content: string | undefined,
    isbn: string | undefined,
    ndc: number | undefined,
    year: number | undefined,
    authorId: number,
    authorName: string,
    publisherId: number,
    publisherName: string
  ): Promise<void> {
    const author = new AuthorModel(authorId, authorName)
    const publisher = new PublisherModel(publisherId, publisherName)
    const book = new BookModel(
      this.bookService.createUUID(),
      bookName,
      subName,
      content,
      isbn,
      ndc,
      year,
      author,
      publisher
    )
    await this.bookRepository.save(book)
  }

  public async deleteBooks (): Promise<void> {
    await this.bookRepository.deleteAll()
  }
}
