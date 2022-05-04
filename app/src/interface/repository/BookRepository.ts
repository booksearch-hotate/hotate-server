import Book from "../../infrastructure/db/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../infrastructure/db/author"
import Publisher from "../../infrastructure/db/publisher"
import IBookApplicationRepository from "../../application/repository/IBookApplicationRepository"
import BookModel from "../../domain/model/bookModel"
import Elasticsearch from "../../infrastructure/elasticsearch"

import { IEsBook } from "../../interfaces/IElasticSearchDocument"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author,
  Publisher: typeof Publisher
}

export default class BookRepository implements IBookApplicationRepository {
  private readonly db: sequelize
  private readonly elasticsearch: Elasticsearch

  public constructor (db: sequelize, elasticsearch: Elasticsearch) {
    this.db = db
    this.elasticsearch = elasticsearch
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
}
