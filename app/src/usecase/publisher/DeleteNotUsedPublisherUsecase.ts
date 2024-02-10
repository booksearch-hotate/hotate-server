import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IPublisherESRepository} from "../../domain/repository/es/IPublisherESRepository";
import {Usecase} from "../Usecase";

export default class DeleteNotUsedPublisherUseCase implements Usecase<void, Promise<void>> {
  private readonly publisherDB: IPublisherDBRepository;
  private readonly publisherES: IPublisherESRepository;

  public constructor(publisherDB: IPublisherDBRepository, publisherES: IPublisherESRepository) {
    this.publisherDB = publisherDB;
    this.publisherES = publisherES;
  }

  public async execute(): Promise<void> {
    const publishers = await this.publisherDB.findNotUsed();

    await Promise.all([
      this.publisherDB.deletePublishers(publishers.map((publisher) => publisher.Id)),
      this.publisherES.deletePublishers(publishers.map((publisher) => publisher.Id)),
    ]);
  }
}
