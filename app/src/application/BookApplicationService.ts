import IBookApplicationRepository from "./repository/IBookApplicationRepository"
import BookModel from "../domain/model/bookModel"
import AuthorModel from "../domain/model/authorModel"
import PublisherModel from "../domain/model/publisherModel"
import BookService from "../domain/service/bookService"
import BookData from "./dto/BookData"

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
    content: string | null,
    isbn: string | null,
    ndc: number | null,
    year: number | null,
    authorId: string,
    authorName: string,
    publisherId: string,
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

  public async searchBooks (query: string): Promise<BookData[]> {
    const books = await this.bookRepository.search(query) // 検索から得られたbookModelの配列
    /* DTOに変換 */
    let bookDatas: BookData[] = []
    for (const book of books) bookDatas.push(new BookData(book))
  
    return bookDatas
  }
}
