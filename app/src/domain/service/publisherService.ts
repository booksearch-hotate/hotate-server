import Publisher from '../model/publisher/publisher';

import {IPublisherRepository} from '../model/publisher/IPublisherRepository';

import {v4 as uuidv4} from 'uuid';

export default class PublisherService {
  private readonly publisherRepository: IPublisherRepository;

  public constructor(publisherRepository: IPublisherRepository) {
    this.publisherRepository = publisherRepository;
  }

  public async isExist(publisher: Publisher): Promise<boolean> {
    const found = await this.publisherRepository.findByName(publisher.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }
}
