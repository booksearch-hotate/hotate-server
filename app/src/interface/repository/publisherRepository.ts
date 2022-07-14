import sequelize from 'sequelize';

import Publisher from '../../infrastructure/db/tables/publishers';
import Book from '../../infrastructure/db/tables/books';

import {IPublisherRepository} from '../../domain/model/publisher/IPublisherRepository';
import PublisherModel from '../../domain/model/publisher/publisherModel';

import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';

import {IEsPublisher} from '../../infrastructure/elasticsearch/documents/IEsPublisher';

/* Sequelizeを想定 */
interface sequelize {
  Publisher: typeof Publisher,
  Book: typeof Book,
}

export default class PublisherRepository implements IPublisherRepository {
  private readonly db: sequelize;
  private readonly esPublisher: EsPublisher;

  public constructor(db: sequelize, esPublisher: EsPublisher) {
    this.db = db;
    this.esPublisher = esPublisher;
  }

  public async save(publisher: PublisherModel, isBulk: boolean = false): Promise<void> {
    await this.db.Publisher.create({
      id: publisher.Id,
      name: publisher.Name,
    });

    const doc: IEsPublisher = {
      db_id: publisher.Id,
      name: publisher.Name,
    };
    if (isBulk) this.esPublisher.insertBulk(doc);
    else await this.esPublisher.create(doc);
  }

  public async findByName(name: string | null): Promise<PublisherModel | null> {
    const publisher = await this.db.Publisher.findOne({
      attributes: ['id'],
      where: {name},
    });
    if (publisher) return new PublisherModel(publisher.id, publisher.name);
    return null;
  }
  public async deleteAll(): Promise<void> {
    const deletes = [this.db.Publisher.destroy({where: {}}), this.esPublisher.initIndex()];

    await Promise.all(deletes);
  }
  public async executeBulkApi(): Promise<void> {
    await this.esPublisher.executeBulkApi();
  }

  public async deleteNoUsed(publisherId: string): Promise<void> {
    const count = await this.db.Book.count({
      where: {
        publisher_id: publisherId,
      },
    });

    if (Number(count) === 0) {
      const list = [
        this.db.Publisher.destroy({
          where: {
            id: publisherId,
          },
        }),
        this.esPublisher.delete(publisherId),
      ];
      await Promise.all(list);
    }
  }
}
