import Publisher from "../model/publisher/publisher";

import {v4 as uuidv4} from "uuid";
import {IPublisherDBRepository} from "../repository/db/IPublisherDBRepository";

export default class PublisherService {
  private readonly publisherRepository: IPublisherDBRepository;

  public constructor(publisherRepository: IPublisherDBRepository) {
    this.publisherRepository = publisherRepository;
  }

  public async isExist(publisher: Publisher): Promise<boolean> {
    if (publisher.Name === null) return false;
    const found = await this.publisherRepository.findByName(publisher.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }
}
