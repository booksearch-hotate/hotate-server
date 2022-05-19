import Publisher from '../../infrastructure/db/tables/publisher';
import {IPublisherApplicationRepository} from '../../application/repository/IPublisherApplicationRepository';
import {IPublisherDomainRepository} from '../../domain/service/repository/IPublisherDomainRepository';
import PublisherModel from '../../domain/model/publisherModel';

import Elasticsearch from '../../infrastructure/elasticsearch';

import {IEsPublisher} from '../../infrastructure/elasticsearch/IElasticSearchDocument';

/* Sequelizeを想定 */
interface sequelize {
  Publisher: typeof Publisher
}

export default class PublisherRepository implements IPublisherApplicationRepository, IPublisherDomainRepository {
  private readonly db: sequelize;
  private readonly elasticsearch: Elasticsearch;

  public constructor(db: sequelize, elasticsearch: Elasticsearch) {
    this.db = db;
    this.elasticsearch = elasticsearch;
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
    await this.elasticsearch.create(doc);
  }

  public async findByName(name: string | null): Promise<PublisherModel | null> {
    const publisher = await this.db.Publisher.findOne({
      where: {name},
    });
    if (publisher) return new PublisherModel(publisher.id, publisher.name);
    return null;
  }
  public async deleteAll(): Promise<void> {
    await this.db.Publisher.destroy({where: {}});
    await this.elasticsearch.initIndex();
  }
}
