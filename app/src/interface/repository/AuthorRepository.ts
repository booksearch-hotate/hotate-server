import Author from "../../infrastructure/db/tables/author"
import IAuthorApplicationRepository from "../../application/repository/IAuthorApplicationRepository"
import IAuthorDomainRepository from "../../domain/service/repository/IAuthorDomainRepository"
import AuthorModel from "../../domain/model/authorModel"
import Elasticsearch from "../../infrastructure/elasticsearch"

import { IEsAuthor } from "../../infrastructure/elasticsearch/IElasticSearchDocument"

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof Author
}

export default class AuthorRepository implements IAuthorApplicationRepository, IAuthorDomainRepository {
  private readonly db: sequelize
  private readonly elasticsearch: Elasticsearch

  public constructor (db: sequelize, elasticsearch: Elasticsearch) {
    this.db = db
    this.elasticsearch = elasticsearch
  }

  public async save (author: AuthorModel): Promise<void> {
    await this.db.Author.create({
      id: author.Id,
      name: author.Name
    })
    const doc: IEsAuthor = {
      db_id: author.Id,
      name: author.Name
    }
    await this.elasticsearch.create(doc)
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
    await this.elasticsearch.initIndex()
  }
}
