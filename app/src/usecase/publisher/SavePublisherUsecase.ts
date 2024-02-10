import Publisher from "../../domain/model/publisher/publisher";
import PublisherId from "../../domain/model/publisher/publisherId";
import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IPublisherESRepository} from "../../domain/repository/es/IPublisherESRepository";
import PublisherService from "../../domain/service/publisherService";
import PublisherSaveInputData from "../../presentation/dto/publisher/save/PublisherSaveInputData";
import PublisherSaveOutputData from "../../presentation/dto/publisher/save/PublisherSaveOutputData";
import {Usecase} from "../Usecase";

export default class SavePublisherUseCase implements Usecase<PublisherSaveInputData, Promise<PublisherSaveOutputData>> {
  private publisherDB: IPublisherDBRepository;
  private publisherES: IPublisherESRepository;

  private publisherService: PublisherService;

  public constructor(
      publisherDB: IPublisherDBRepository,
      publisherES: IPublisherESRepository,
      publisherService: PublisherService,
  ) {
    this.publisherDB = publisherDB;
    this.publisherES = publisherES;
    this.publisherService = publisherService;
  }

  public async execute(input: PublisherSaveInputData): Promise<PublisherSaveOutputData> {
    let publisher = new Publisher(
        new PublisherId(null),
        input.name,
    );

    if (await this.publisherService.isExist(publisher)) {
      const findPublisher = await this.publisherDB.findByName(input.name);

      if (findPublisher === null) throw new Error("同名の出版社は存在しますが、DBに登録されていませんでした。");

      publisher = findPublisher;
    } else {
      await Promise.all([
        this.publisherDB.save(publisher),
        this.publisherES.save(publisher),
      ]);
    }

    return new PublisherSaveOutputData(publisher.Id);
  }
}
