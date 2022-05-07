import PublisherModel from "../../model/publisherModel"

export default interface IPublisherDomainRepository {
  findByName (name: string): Promise<PublisherModel | null>
}
