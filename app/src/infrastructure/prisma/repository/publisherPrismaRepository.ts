import {PrismaClient} from "@prisma/client";
import {IPublisherDBRepository} from "../../../domain/repository/db/IPublisherDBRepository";
import Publisher from "../../../domain/model/publisher/publisher";
import PublisherId from "../../../domain/model/publisher/publisherId";

export default class PublisherPrismaRepository implements IPublisherDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findById(id: PublisherId): Promise<Publisher | null> {
    const publisher = await this.db.publishers.findFirst({where: {id: id.Id}});
    if (publisher === null) return null;

    return new Publisher(new PublisherId(publisher.id), publisher.name);
  }

  public async findByName(name: string): Promise<Publisher | null> {
    const publisher = await this.db.publishers.findFirst({where: {name: name}});
    if (publisher === null) return null;

    return new Publisher(new PublisherId(publisher.id), publisher.name);
  }

  public async update(publisher: Publisher): Promise<void> {
    await this.db.publishers.update({
      where: {id: publisher.Id.Id},
      data: {name: publisher.Name},
    });
  }

  public async save(publisher: Publisher): Promise<void> {
    await this.db.publishers.create({
      data: {
        id: publisher.Id.Id,
        name: publisher.Name,
      },
    });
  }

  public async findNotUsed(): Promise<Publisher[]> {
    const publishers = await this.db.publishers.findMany({
      where: {
        books: {
          none: {},
        },
      },
    });

    return publishers.map((publisher) => new Publisher(new PublisherId(publisher.id), publisher.name));
  }

  public async deletePublishers(ids: PublisherId[]): Promise<void> {
    await this.db.publishers.deleteMany({where: {id: {in: ids.map((id) => id.Id)}}});
  }

  public async deletePublisher(id: PublisherId): Promise<void> {
    await this.deletePublishers([id]);
  }

  public async saveMany(publishers: Publisher[]): Promise<void> {
    await this.db.publishers.createMany({
      data: publishers.map((publisher) => {
        return {
          id: publisher.Id.Id,
          name: publisher.Name,
        };
      }),
    });
  }
};
