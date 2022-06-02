import Author from '../../infrastructure/db/tables/author';
import {IAuthorApplicationRepository} from '../../application/repository/IAuthorApplicationRepository';
import {IAuthorDomainRepository} from '../../domain/service/repository/IAuthorDomainRepository';
import AuthorModel from '../../domain/model/authorModel';
import EsCsv from '../../infrastructure/elasticsearch/esCsv';

import {IEsAuthor} from '../../infrastructure/elasticsearch/IElasticSearchDocument';

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof Author
}

export default class AuthorRepository implements IAuthorApplicationRepository, IAuthorDomainRepository {
  private readonly db: sequelize;
  private readonly esCsv: EsCsv;

  public constructor(db: sequelize, esCsv: EsCsv) {
    this.db = db;
    this.esCsv = esCsv;
  }

  public async save(author: AuthorModel): Promise<void> {
    await this.db.Author.create({
      id: author.Id,
      name: author.Name,
    });

    const doc: IEsAuthor = {
      db_id: author.Id,
      name: author.Name,
    };
    this.esCsv.create(doc);
  }

  public async findByName(name: string | null): Promise<AuthorModel | null> {
    const author = await this.db.Author.findOne({
      where: {name},
    });
    if (author) return new AuthorModel(author.id, author.name);
    return null;
  }

  public async deleteAll(): Promise<void> {
    const deletes = [this.db.Author.destroy({where: {}}), this.esCsv.initIndex()];
    await Promise.all(deletes);
  }

  public async executeBulkApi(): Promise<void> {
    await this.esCsv.executeBulkApi();
  }
}
