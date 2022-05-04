import Book from "../../infrastructure/db/book" // ここのBookはドメインオブジェクトではない！
import Author from "../../infrastructure/db/author"
import Publisher from "../../infrastructure/db/publisher"

import IPublisherRepository from "./IPublisherRepository"
import PublisherModel from "../../domain/model/publisherModel"

import Elasticsearch from "../../infrastructure/elasticsearch"

import { IEsPublisher } from "../../interfaces/IElasticSearchDocument"

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book,
  Author: typeof Author,
  Publisher: typeof Publisher
}

export default class PublisherRepository implements IPublisherRepository {
  private readonly db: sequelize
  private readonly elasticsearch: Elasticsearch

  public constructor (db: sequelize, elasticsearch: Elasticsearch) {
    this.db = db
    this.elasticsearch = elasticsearch
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
    const doc: IEsPublisher = {
      db_id: publisher.Id,
      name: publisher.Name
    }
    await this.elasticsearch.create(doc)
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
    await this.elasticsearch.initIndex()
  }
}
