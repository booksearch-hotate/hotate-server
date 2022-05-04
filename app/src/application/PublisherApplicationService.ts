import IPublisherRepository from "../repository/publisher/IPublisherRepository"
import PublisherModel from "../domain/model/publisherModel"
import PublisherService from "../domain/service/publisherService"

export default class PublisherApplicationService {
  private readonly publisherRepository: IPublisherRepository
  private readonly publisherService: PublisherService

  public constructor (publisherRepository: IPublisherRepository) {
    this.publisherRepository = publisherRepository
    this.publisherService = new PublisherService(publisherRepository)
  }

  public async createPublisher (name: string): Promise<number> {
    const publisher = new PublisherModel(await this.publisherRepository.getMaximumId() + 1, name)
    let id
    if (await this.publisherService.isExist(publisher)) {
      const found = await this.publisherRepository.findByName(publisher.Name)
      if (found === null) throw new Error("Publisher not found")
      id = found.Id
    } else {
      await this.publisherRepository.save(publisher)
      id = publisher.Id
    }
    return id
  }

  public async deletePublishers (): Promise<void> {
    await this.publisherRepository.deleteAll()
  }
}
