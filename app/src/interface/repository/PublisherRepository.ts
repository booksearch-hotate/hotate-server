import sequelize from 'sequelize';

import Publisher from '../../infrastructure/db/tables/publisher';
import Book from '../../infrastructure/db/tables/book';

import {IPublisherApplicationRepository} from '../../application/repository/IPublisherApplicationRepository';
import {IPublisherDomainRepository} from '../../domain/service/repository/IPublisherDomainRepository';
import PublisherModel from '../../domain/model/publisherModel';

import EsCsv from '../../infrastructure/elasticsearch/esCsv';

import {IEsPublisher} from '../../infrastructure/elasticsearch/IElasticSearchDocument';

/* Sequelizeを想定 */
interface sequelize {
  Publisher: typeof Publisher,
  Book: typeof Book,
}

export default class PublisherRepository implements IPublisherApplicationRepository, IPublisherDomainRepository {
  private readonly db: sequelize;
  private readonly esCsv: EsCsv;

  public constructor(db: sequelize, esCsv: EsCsv) {
    this.db = db;
    this.esCsv = esCsv;
  }

  public async save(publisher: PublisherModel): Promise<void> {
    await this.db.Publisher.create({
      id: publisher.Id,
      name: publisher.Name,
    });

    const doc: IEsPublisher = {
      db_id: publisher.Id,
      name: publisher.Name,
    };
    this.esCsv.create(doc);
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
    const deletes = [this.db.Publisher.destroy({where: {}}), this.esCsv.initIndex()];

    await Promise.all(deletes);
  }
  public async executeBulkApi(): Promise<void> {
    await this.esCsv.executeBulkApi();
  }

  public async deleteNoUsed(publisherId: string): Promise<void> {
    const sql = await this.db.Publisher.findOne({
      attributes: [
        'id',
        [sequelize.fn('count', sequelize.col('Publisher.id')), 'count'],
      ],
      where: {
        id: publisherId,
      },
      group: ['Books.publisher_id'],
      include: [{
        model: this.db.Book,
        required: true,
        attributes: [],
      }],
    });

    if (sql === null) return;

    const count = sql.getDataValue('count');

    if (Number(count) === 0) {
      await this.db.Publisher.destroy({
        where: {
          id: publisherId,
        },
      });
    }
  }
}
