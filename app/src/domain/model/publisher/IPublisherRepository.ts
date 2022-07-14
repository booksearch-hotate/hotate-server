import PublisherModel from './publisherModel';

export interface IPublisherRepository {
  save (publisher: PublisherModel, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<PublisherModel | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  deleteNoUsed(publisherId: string): Promise<void>
}
