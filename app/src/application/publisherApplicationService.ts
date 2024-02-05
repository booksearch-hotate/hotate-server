import {IPublisherRepository} from '../domain/model/publisher/IPublisherRepository';
import Publisher from '../domain/model/publisher/publisher';
import PublisherService from '../domain/service/publisherService';
import {InfrastructureError} from '../presentation/error';

export default class PublisherApplicationService {
  private readonly publisherRepository: IPublisherRepository;
  private readonly publisherService: PublisherService;

  public constructor(publisherRepository: IPublisherRepository, publisherService: PublisherService) {
    this.publisherRepository = publisherRepository;
    this.publisherService = publisherService;
  }

  public async createPublisher(name: string, isBulk: boolean): Promise<string> {
    const publisher = new Publisher(this.publisherService.createUUID(), name);
    let id;
    if (await this.publisherService.isExist(publisher)) {
      const found = await this.publisherRepository.findByName(publisher.Name);
      if (found === null) throw new InfrastructureError('The publisher should already exist, but could not find it.');
      id = found.Id;
    } else {
      await this.publisherRepository.save(publisher, isBulk);
      id = publisher.Id;
    }
    return id;
  }

  public async deletePublishers(): Promise<void> {
    await this.publisherRepository.deleteAll();
  }

  public async executeBulkApi(): Promise<void> {
    await this.publisherRepository.executeBulkApi();
  }

  /**
   * 出版社IDに対応する本データが見つからない場合、出版社データを削除します。
   * @param publisherId 出版社ID
   */
  public async deleteNotUsed(publisherId: string): Promise<void> {
    await this.publisherRepository.deleteNoUsed(publisherId);
  }

  public async update(publisherId: string, publisherName: string): Promise<void> {
    const publisher = await this.publisherRepository.findById(publisherId);

    publisher.changeName(publisherName);

    await this.publisherRepository.update(publisher);
  }
}
