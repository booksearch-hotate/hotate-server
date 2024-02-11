import {IPublisherDBRepository} from "../../domain/repository/db/IPublisherDBRepository";
import {IPublisherESRepository} from "../../domain/repository/es/IPublisherESRepository";
import PublisherService from "../../domain/service/publisherService";
import PublisherUpdateInputData from "../../presentation/dto/publisher/update/PublisherUpdateInputData";
import PublisherUpdateOutputData from "../../presentation/dto/publisher/update/PublisherUpdateOutputData";
import {Usecase} from "../Usecase";

export default class UpdatePublisherUsecase implements Usecase<PublisherUpdateInputData, Promise<PublisherUpdateOutputData>> {
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

  public async execute(input: PublisherUpdateInputData): Promise<PublisherUpdateOutputData> {
    let publisher = await this.publisherDB.findById(input.id);

    if (publisher === null) throw new Error("著者が見つかりませんでした。");

    publisher.changeName(input.name);

    if (await this.publisherService.isExist(publisher) && publisher.Name !== null) {
      publisher = await this.publisherDB.findByName(publisher.Name); // 既に登録されている出版社の情報を取得

      if (publisher === null) throw new Error("著者が見つかりませんでした。");
    } else {
      await Promise.all([await this.publisherDB.update(publisher), await this.publisherES.update(publisher)]);
    }

    return new PublisherUpdateOutputData(publisher.Id);
  }
}
