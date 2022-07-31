import PublisherModel from './publisherModel';

export interface IPublisherRepository {
  save (publisher: PublisherModel, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<PublisherModel | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  deleteNoUsed(publisherId: string): Promise<void>
  findById(publisherId: string): Promise<PublisherModel>
  update(publisher: PublisherModel): Promise<void>
  search(name: string): Promise<PublisherModel[]>
  searchUsingLike(name: string): Promise<PublisherModel[]>
}
