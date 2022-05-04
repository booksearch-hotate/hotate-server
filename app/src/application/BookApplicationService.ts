import IBookApplicationRepository from "./repository/IBookApplicationRepository"
import BookModel from "../domain/model/bookModel"
import AuthorModel from "../domain/model/authorModel"
import PublisherModel from "../domain/model/publisherModel"

export default class BookApplicationService {
  private readonly bookRepository: IBookApplicationRepository

  public constructor (bookRepository: IBookApplicationRepository) {
    this.bookRepository = bookRepository
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
      await this.bookRepository.getMaximumId() + 1,
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
