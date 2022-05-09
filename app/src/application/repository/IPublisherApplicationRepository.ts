import PublisherModel from "../../domain/model/publisherModel"

export default interface IPublisherApplicationRepository {
  save (publisher: PublisherModel): Promise<void>
  findByName (name: string | null): Promise<PublisherModel | null>
  deleteAll (): Promise<void>
}
