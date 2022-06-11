import Author from '../../infrastructure/db/tables/author';
import Book from '../../infrastructure/db/tables/book';

import {IAuthorApplicationRepository} from '../../application/repository/IAuthorApplicationRepository';
import {IAuthorDomainRepository} from '../../domain/service/repository/IAuthorDomainRepository';
import AuthorModel from '../../domain/model/authorModel';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';

import {IEsAuthor} from '../../infrastructure/elasticsearch/IElasticSearchDocument';

import sequelize from 'sequelize';

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof Author,
  Book: typeof Book
}

export default class AuthorRepository implements IAuthorApplicationRepository, IAuthorDomainRepository {
  private readonly db: sequelize;
  private readonly esAuthor: EsAuthor;

  public constructor(db: sequelize, esAuthor: EsAuthor) {
    this.db = db;
    this.esAuthor = esAuthor;
  }

  public async save(author: AuthorModel, isBulk: boolean = false): Promise<void> {
    await this.db.Author.create({
      id: author.Id,
      name: author.Name,
    });

    const doc: IEsAuthor = {
      db_id: author.Id,
      name: author.Name,
    };
    if (isBulk) this.esAuthor.insertBulk(doc);
    else await this.esAuthor.create(doc);
  }

  public async findByName(name: string | null): Promise<AuthorModel | null> {
    const author = await this.db.Author.findOne({
      attributes: ['id'],
      where: {name},
    });
    if (author) return new AuthorModel(author.id, author.name);
    return null;
  }

  public async deleteAll(): Promise<void> {
    const deletes = [this.db.Author.destroy({where: {}}), this.esAuthor.initIndex()];
    await Promise.all(deletes);
  }

  public async executeBulkApi(): Promise<void> {
    await this.esAuthor.executeBulkApi();
  }

  public async findById(authorId: string): Promise<AuthorModel> {
    const author = await this.db.Author.findOne({
      attributes: ['id', 'name'],
      where: {id: authorId},
    });
    if (author) return new AuthorModel(author.id, author.name);
    throw new Error('Author not found');
  }

  public async deleteNoUsed(authorId: string): Promise<void> {
    const count = await this.db.Book.count({
      where: {
        author_id: authorId,
      },
    });

    if (Number(count) === 0) {
      const list =[
        this.db.Author.destroy({
          where: {
            id: authorId,
          },
        }),
        this.esAuthor.delete(authorId),
      ];
      await Promise.all(list);
    }
  }
}
