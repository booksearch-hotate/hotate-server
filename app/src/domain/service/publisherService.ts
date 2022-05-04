import PublisherModel from "../model/publisherModel"
import IPublisherRepository from "../../repository/publisher/IPublisherRepository"

export default class PublisherService {
  private readonly publisherRepository: IPublisherRepository

  public constructor (publisherRepository: IPublisherRepository) {
    this.publisherRepository = publisherRepository
  }

  public async isExist (publisher: PublisherModel): Promise<boolean> {
    const found = await this.publisherRepository.findByName(publisher.Name)
    return found !== null
  }
}
