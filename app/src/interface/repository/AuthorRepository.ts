import Author from '../../infrastructure/db/tables/author';
import Book from '../../infrastructure/db/tables/book';

import {IAuthorApplicationRepository} from '../../application/repository/IAuthorApplicationRepository';
import {IAuthorDomainRepository} from '../../domain/service/repository/IAuthorDomainRepository';
import AuthorModel from '../../domain/model/authorModel';
import EsCsv from '../../infrastructure/elasticsearch/esCsv';

import {IEsAuthor} from '../../infrastructure/elasticsearch/IElasticSearchDocument';

import sequelize from 'sequelize';

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof Author,
  Book: typeof Book
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
      attributes: ['id'],
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

  public async findById(authorId: string): Promise<AuthorModel> {
    const author = await this.db.Author.findOne({
      attributes: ['id', 'name'],
      where: {id: authorId},
    });
    if (author) return new AuthorModel(author.id, author.name);
    throw new Error('Author not found');
  }

  public async deleteNoUsed(authorId: string): Promise<void> {
    const sql = await this.db.Author.findOne({
      attributes: [
        'id',
        [sequelize.fn('count', sequelize.col('Author.id')), 'count'],
      ],
      where: {
        id: authorId,
      },
      group: ['Books.author_id'],
      include: [{
        model: this.db.Book,
        required: true,
        attributes: [],
      }],
    });

    if (sql === null) return;

    const count = sql.getDataValue('count');

    if (Number(count) === 0) {
      await this.db.Author.destroy({
        where: {
          id: authorId,
        },
      });
    }
  }
}
