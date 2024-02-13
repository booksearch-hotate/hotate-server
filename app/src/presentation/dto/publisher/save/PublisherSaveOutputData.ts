import PublisherId from "../../../../domain/model/publisher/publisherId";

export default class PublisherSaveOutputData {
  public publisherId: string;

  public constructor(publisherId: PublisherId) {
    this.publisherId = publisherId.Id;
  }
}
