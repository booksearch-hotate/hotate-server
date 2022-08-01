import Publisher from './publisherModel';

export interface IPublisherRepository {
  save (publisher: Publisher, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<Publisher | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  deleteNoUsed(publisherId: string): Promise<void>
  findById(publisherId: string): Promise<Publisher>
  update(publisher: Publisher): Promise<void>
  search(name: string): Promise<Publisher[]>
  searchUsingLike(name: string): Promise<Publisher[]>
}
