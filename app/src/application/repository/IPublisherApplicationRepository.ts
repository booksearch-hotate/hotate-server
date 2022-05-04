import PublisherModel from "../../domain/model/publisherModel"

export default interface IPublisherApplicationRepository {
  getMaximumId (): Promise<number>
  save (publisher: PublisherModel): Promise<void>
  findByName (name: string): Promise<PublisherModel | null>
  deleteAll (): Promise<void>
}
