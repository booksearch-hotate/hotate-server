import AuthorTable from '../../infrastructure/db/tables/authors';
import BookTable from '../../infrastructure/db/tables/books';

import {IAuthorRepository} from '../../domain/model/author/IAuthorRepository';
import Author from '../../domain/model/author/author';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';

import {IEsAuthor} from '../../infrastructure/elasticsearch/documents/IEsAuthor';

import sequelize from 'sequelize';
import {MySQLDBError} from '../../presentation/error';

/* Sequelizeを想定 */
interface sequelize {
  Author: typeof AuthorTable,
  Book: typeof BookTable
}

export default class AuthorRepository implements IAuthorRepository {
  private readonly db: sequelize;
  private readonly esAuthor: EsAuthor;

  public constructor(db: sequelize, esAuthor: EsAuthor) {
    this.db = db;
    this.esAuthor = esAuthor;
  }

  public async save(author: Author, isBulk: boolean = false): Promise<void> {
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

  public async findByName(name: string | null): Promise<Author | null> {
    const author = await this.db.Author.findOne({
      attributes: ['id'],
      where: {name},
    });
    if (author) return new Author(author.id, author.name);
    return null;
  }

  public async deleteAll(): Promise<void> {
    const deletes = [this.db.Author.destroy({where: {}}), this.esAuthor.initIndex()];
    await Promise.all(deletes);
  }

  public async executeBulkApi(): Promise<void> {
    await this.esAuthor.executeBulkApi();
  }

  public async findById(authorId: string): Promise<Author> {
    const author = await this.db.Author.findOne({
      attributes: ['id', 'name'],
      where: {id: authorId},
    });

    if (author) return new Author(author.id, author.name);

    throw new MySQLDBError('Author not found');
  }

  public async deleteNoUsed(authorId: string): Promise<void> {
    const count = await this.db.Book.count({
      where: {
        author_id: authorId,
      },
    });

    if (count === 0) {
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

  public async update(author: Author): Promise<void> {
    const updateDB = async (a: Author) => {
      await this.db.Author.update({
        name: a.Name,
      }, {where: {id: a.Id}});
    };

    const updateES = async (a: Author) => {
      await this.esAuthor.update({db_id: a.Id, name: a.Name});
    };

    await Promise.all([updateDB(author), updateES(author)]);
  }

  public async search(name: string): Promise<Author[]> {
    const ids = await this.esAuthor.search(name);
    const fetchData = await this.db.Author.findAll({
      where: {
        id: {
          [sequelize.Op.in]: ids,
        },
      },
    });

    if (fetchData === null) return [];

    return fetchData.map((column) => new Author(column.id, column.name));
  }

  public async searchUsingLike(name: string): Promise<Author[]> {
    const ids = await this.esAuthor.searchUsingLike(name);
    const fetchData = await this.db.Author.findAll({
      where: {
        id: {
          [sequelize.Op.in]: ids,
        },
      },
    });

    if (fetchData === null) return [];

    return fetchData.map((column) => new Author(column.id, column.name));
  }
}
