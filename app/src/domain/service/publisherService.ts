import PublisherModel from '../model/publisherModel';
import {IPublisherDomainRepository}
  from './repository/IPublisherDomainRepository';

import {v4 as uuidv4} from 'uuid';

export default class PublisherService {
  private readonly publisherRepository: IPublisherDomainRepository;

  public constructor(publisherRepository: IPublisherDomainRepository) {
    this.publisherRepository = publisherRepository;
  }

  public async isExist(publisher: PublisherModel): Promise<boolean> {
    const found = await this.publisherRepository.findByName(publisher.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }
}
