import Author from '../../infrastructure/db/tables/authors';
import Book from '../../infrastructure/db/tables/books';

import {IAuthorRepository} from '../../domain/model/author/IAuthorRepository';
import AuthorModel from '../../domain/model/author/authorModel';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';

import {IEsAuthor} from '../../infrastructure/elasticsearch/documents/IEsAuthor';

import sequelize from 'sequelize';

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof Author,
  Book: typeof Book
}

export default class AuthorRepository implements IAuthorRepository {
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

  public async update(author: AuthorModel): Promise<void> {
    const updateDB = async (a: AuthorModel) => {
      await this.db.Author.update({
        name: a.Name,
      }, {where: {id: a.Id}});
    };

    const updateES = async (a: AuthorModel) => {
      await this.esAuthor.update({db_id: a.Id, name: a.Name});
    };

    await Promise.all([updateDB(author), updateES(author)]);
  }
}
