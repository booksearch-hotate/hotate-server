import Book from "../../db/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../db/author"
import Publisher from "../../db/publisher"
import IAuthorRepository from "./IAuthorRepository"
import AuthorModel from "../../domain/model/authorModel"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author,
  Publisher: typeof Publisher
}

export default class AuthorRepository implements IAuthorRepository {
  private readonly db: sequelize
  public constructor (db: sequelize) {
    this.db = db
  }

  public async getMaximumId (): Promise<number> {
    const author = await this.db.Author.findOne({
      order: [['id', 'DESC']]
    })
    if (author) return author.id
    return 0 // 初期値
  }

  public async save (author: AuthorModel): Promise<void> {
    await this.db.Author.create({
      id: author.Id,
      name: author.Name
    })
  }

  public async findByName (name: string): Promise<AuthorModel | null> {
    const author = await this.db.Author.findOne({
      where: { name }
    })
    if (author) return new AuthorModel(author.id, author.name)
    return null
  }

  public async deleteAll (): Promise<void> {
    await this.db.Author.destroy({ where: {} })
  }
}
