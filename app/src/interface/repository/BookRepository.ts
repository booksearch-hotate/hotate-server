import Book from "../../infrastructure/db/tables/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../infrastructure/db/tables/author"
import Publisher from "../../infrastructure/db/tables/publisher"
import IBookApplicationRepository from "../../application/repository/IBookApplicationRepository"
import BookModel from "../../domain/model/bookModel"
import AuthorModel from "../../domain/model/authorModel"
import PublisherModel from "../../domain/model/publisherModel"
import Elasticsearch from "../../infrastructure/elasticsearch"

import { IEsBook } from "../../infrastructure/elasticsearch/IElasticSearchDocument"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author
  Publisher: typeof Publisher
}

export default class BookRepository implements IBookApplicationRepository {
  private readonly db: sequelize
  private readonly elasticsearch: Elasticsearch

  public constructor (db: sequelize, elasticsearch: Elasticsearch) {
    this.db = db
    this.elasticsearch = elasticsearch
  }

  public async save (book: BookModel): Promise<void> {
    await this.db.Book.create({
      id: book.Id,
      book_name: book.Name,
      book_sub_name: book.SubName,
      book_content: book.Content,
      isbn: book.Isbn,
      ndc: book.Ndc,
      year: book.Year,
      author_id: book.Author.Id,
      publisher_id: book.Publisher.Id
    })
    const doc: IEsBook = {
      db_id: book.Id,
      book_name: book.Name,
      book_content: book.Content,
    }
    await this.elasticsearch.create(doc)
  }

  public async deleteAll (): Promise<void> {
    await this.db.Book.destroy({ where: {} })
    await this.elasticsearch.initIndex()
  }

  public async search (query: string): Promise<BookModel[]> {
    const bookIds = await this.elasticsearch.searchBooks(query) // 検索にヒットしたidの配列
    // bookIdsからbooksを取得する
    const books = await this.db.Book.findAll({ where: { id: bookIds } })

    const bookModels: BookModel[] = []

    for (const fetchBook of books) {
      const authorId = fetchBook.author_id
      const publisherId = fetchBook.publisher_id

      const author = await this.db.Author.findOne({ where: { id: authorId } }) // authorを取得
      const publisher = await this.db.Publisher.findOne({ where: { id: publisherId } }) // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found')

      const authorModel = new AuthorModel(author.id, author.name)
      const publisherModel = new PublisherModel(publisher.id, publisher.name)

      const bookModel = new BookModel(
        fetchBook.id,
        fetchBook.book_name,
        fetchBook.book_sub_name,
        fetchBook.book_content,
        fetchBook.isbn,
        fetchBook.ndc,
        fetchBook.year,
        authorModel,
        publisherModel
      )
      bookModels.push(bookModel)
    }
    return bookModels
  }
}
