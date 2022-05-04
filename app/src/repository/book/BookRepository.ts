import Book from "../../infrastructure/db/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../infrastructure/db/author"
import Publisher from "../../infrastructure/db/publisher"
import IBookRepository from "./IBookRepository"
import BookModel from "../../domain/model/bookModel"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author,
  Publisher: typeof Publisher
}

export default class BookRepository implements IBookRepository {
  private readonly db: sequelize
  public constructor (db: sequelize) {
    this.db = db
  }
  public async getMaximumId (): Promise<number> {
    const book = await this.db.Book.findOne({
      order: [['id', 'DESC']]
    })
    if (book) return book.id
    return 0 // 初期値
  }

  public async save (book: BookModel): Promise<void> {
    await this.db.Book.create({
      id: book.Id,
      book_name: book.Name,
      book_sub_name: book.SubName,
      content: book.Content,
      isbn: book.Isbn,
      ndc: book.Ndc,
      year: book.Year,
      author_id: book.Author.Id,
      publisher_id: book.Publisher.Id
    })
  }

  public async deleteAll (): Promise<void> {
    await this.db.Book.destroy({ where: {} })
  }
}
