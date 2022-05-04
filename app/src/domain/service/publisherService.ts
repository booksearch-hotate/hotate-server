import PublisherModel from "../model/publisherModel"
import IPublisherDomainRepository from "./repository/IPublisherDomainRepository"

export default class PublisherService {
  private readonly publisherRepository: IPublisherDomainRepository

  public constructor (publisherRepository: IPublisherDomainRepository) {
    this.publisherRepository = publisherRepository
  }

  public async isExist (publisher: PublisherModel): Promise<boolean> {
    const found = await this.publisherRepository.findByName(publisher.Name)
    return found !== null
  }
}
