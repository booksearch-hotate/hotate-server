import PublisherModel from '../../model/publisherModel';

export interface IPublisherDomainRepository {
  findByName (name: string | null): Promise<PublisherModel | null>
};
