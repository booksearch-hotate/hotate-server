import PublisherModel from "../../domain/model/publisherModel"

export default interface IPublisherRepository {
  getMaximumId (): Promise<number>
  save (publisher: PublisherModel): Promise<void>
  findByName (name: string): Promise<PublisherModel | null>
  deleteAll (): Promise<void>
}
