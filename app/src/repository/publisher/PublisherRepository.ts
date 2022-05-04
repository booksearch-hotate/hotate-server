import Book from "../../infrastructure/db/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../infrastructure/db/author"
import Publisher from "../../infrastructure/db/publisher"

import IPublisherRepository from "./IPublisherRepository"
import PublisherModel from "../../domain/model/publisherModel"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author,
  Publisher: typeof Publisher
}

export default class PublisherRepository implements IPublisherRepository {
  private readonly db: sequelize
  public constructor (db: sequelize) {
    this.db = db
  }

  public async getMaximumId (): Promise<number> {
    const publisher = await this.db.Publisher.findOne({
      order: [['id', 'DESC']]
    })
    if (publisher) return publisher.id
    return 0 // 初期値
  }

  public async save (publisher: PublisherModel): Promise<void> {
    await this.db.Publisher.create({
      id: publisher.Id,
      name: publisher.Name
    })
  }

  public async findByName (name: string): Promise<PublisherModel | null> {
    const publisher = await this.db.Publisher.findOne({
      where: { name }
    })
    if (publisher) return new PublisherModel(publisher.id, publisher.name)
    return null
  }
  public async deleteAll (): Promise<void> {
    await this.db.Publisher.destroy({ where: {} })
  }
}
