import Publisher from "../../domain/model/publisher/publisher";
import PublisherId from "../../domain/model/publisher/publisherId";
import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IPublisherESRepository} from "../../domain/repository/es/IPublisherESRepository";
import PublisherService from "../../domain/service/publisherService";
import PublisherSaveManyInputData from "../../presentation/dto/publisher/saveMany/PublisherSaveManyInputData";
import PublisherSaveManyOutputData from "../../presentation/dto/publisher/saveMany/PublisherSaveManyOutputData";
import {Usecase} from "../Usecase";

export default class SaveManyPublisherUsecase implements Usecase<PublisherSaveManyInputData, Promise<PublisherSaveManyOutputData>> {
  private readonly publisherDB: IPublisherDBRepository;
  private readonly publisherES: IPublisherESRepository;
  private readonly publisherService: PublisherService;

  public constructor(
      publisherDB: IPublisherDBRepository,
      publisherES: IPublisherESRepository,
      publisherService: PublisherService,
  ) {
    this.publisherDB = publisherDB;
    this.publisherES = publisherES;
    this.publisherService = publisherService;
  }

  public async execute(input: PublisherSaveManyInputData): Promise<PublisherSaveManyOutputData> {
    const publishers: Publisher[] = [];
    const isAlreadyList: Publisher[] = [];

    // 同名がいた場合は登録しない
    for (const name of input.names) {
      const publisher = new Publisher(new PublisherId(null), name);

      if (await this.publisherService.isExist(publisher) && publisher.Name !== null) {
        const alreadyPublisher = await this.publisherDB.findByName(publisher.Name);
        if (alreadyPublisher === null) throw new Error("Publisher not found");

        isAlreadyList.push(alreadyPublisher);
      } else {
        publishers.push(publisher);
      }
    }

    await Promise.all([this.publisherDB.saveMany(publishers), this.publisherES.saveMany(publishers)]);

    return new PublisherSaveManyOutputData(publishers.concat(isAlreadyList));
  }
}
