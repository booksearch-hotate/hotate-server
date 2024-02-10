import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import Publisher from "../../../domain/model/publisher/publisher";
import PublisherId from "../../../domain/model/publisher/publisherId";
import {IPublisherESRepository} from "../../../domain/repository/es/IPublisherESRepository";
import EsPublisher from "../esPublisher";

export default class PublisherESRepository implements IPublisherESRepository {
  private readonly esPublisher: EsPublisher;

  public constructor(esPublisher: EsPublisher) {
    this.esPublisher = esPublisher;
  }

  public async search(
      query: string,
      pageCount: number,
      reqMargin: PaginationMargin,
      isLike: boolean,
  ): Promise<{ ids: PublisherId[]; total: number; }> {
    const data = await this.esPublisher.searchPublisher(query, pageCount, reqMargin, isLike);

    return {
      ids: data.ids.map((id) => new PublisherId(id)),
      total: data.total,
    };
  }

  public async update(publisher: Publisher): Promise<void> {
    const data = {
      db_id: publisher.Id.Id,
      name: publisher.Name,
    };
    await this.esPublisher.update(data);
  }

  public async deletePublishers(ids: PublisherId[]): Promise<void> {
    await this.esPublisher.deleteByIds(ids.map((id) => id.Id));
  }

  public async save(publisher: Publisher): Promise<void> {
    const data = {
      db_id: publisher.Id.Id,
      name: publisher.Name,
    };
    await this.esPublisher.create(data);
  }

  public async saveMany(publishers: Publisher[]): Promise<void> {
    this.esPublisher.createBulkApiFile();

    publishers.forEach((publisher) => {
      const data = {
        db_id: publisher.Id.Id,
        name: publisher.Name,
      };
      this.esPublisher.insertBulk(data);
    });

    await this.esPublisher.executeBulkApi();

    this.esPublisher.removeBulkApiFile();
  }
}
