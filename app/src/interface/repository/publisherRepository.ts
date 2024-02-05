import {IPublisherRepository} from '../../domain/model/publisher/IPublisherRepository';
import Publisher from '../../domain/model/publisher/publisher';

import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';

import {IEsPublisher} from '../../infrastructure/elasticsearch/documents/IEsPublisher';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import {PrismaClient} from '@prisma/client';

export default class PublisherRepository implements IPublisherRepository {
  private readonly db: PrismaClient;
  private readonly esPublisher: EsPublisher;

  public constructor(db: PrismaClient, esPublisher: EsPublisher) {
    this.db = db;
    this.esPublisher = esPublisher;
  }

  public async save(publisher: Publisher, isBulk: boolean = false): Promise<void> {
    await this.db.publishers.create({
      data: {
        id: publisher.Id,
        name: publisher.Name,
      },
    });

    const doc: IEsPublisher = {
      db_id: publisher.Id,
      name: publisher.Name,
    };
    if (isBulk) this.esPublisher.insertBulk(doc);
    else await this.esPublisher.create(doc);
  }

  public async findByName(name: string | null): Promise<Publisher | null> {
    const publisher = await this.db.publishers.findFirst({
      where: {name},
    });
    if (publisher) return new Publisher(publisher.id, publisher.name);
    return null;
  }
  public async deleteAll(): Promise<void> {
    const deletes = [this.db.publishers.deleteMany({where: {}}), this.esPublisher.initIndex()];

    await Promise.all(deletes);
  }
  public async executeBulkApi(): Promise<void> {
    await this.esPublisher.executeBulkApi();
  }

  public async deleteNoUsed(publisherId: string): Promise<void> {
    const count = await this.db.books.count({
      where: {
        publisher_id: publisherId,
      },
    });

    if (Number(count) === 0) {
      const list = [
        this.db.publishers.deleteMany({
          where: {
            id: publisherId,
          },
        }),
        this.esPublisher.delete(publisherId),
      ];
      await Promise.all(list);
    }
  }

  public async findById(publisherId: string): Promise<Publisher> {
    const publisher = await this.db.publishers.findFirst({
      where: {
        id: publisherId,
      },
    });

    if (publisher) return new Publisher(publisher.id, publisher.name);
    throw new MySQLDBError('Author not found');
  }

  public async update(publisher: Publisher): Promise<void> {
    const updateDB = async (p: Publisher) => {
      await this.db.publishers.update({
        where: {
          id: p.Id,
        },
        data: {
          name: p.Name,
        },
      });
    };

    const updateES = async (p: Publisher) => {
      await this.esPublisher.update({db_id: p.Id, name: p.Name});
    };

    await Promise.all([updateDB(publisher), updateES(publisher)]);
  }

  public async search(name: string): Promise<Publisher[]> {
    const ids = await this.esPublisher.search(name);

    const fetchData = await this.db.publishers.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (fetchData === null) return [];

    return fetchData.map((column) => new Publisher(column.id, column.name));
  }

  public async searchUsingLike(name: string): Promise<Publisher[]> {
    const ids = await this.esPublisher.searchUsingLike(name);
    const fetchData = await this.db.publishers.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (fetchData === null) return [];

    return fetchData.map((column) => new Publisher(column.id, column.name));
  }
}
