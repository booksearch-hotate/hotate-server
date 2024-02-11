import PublisherId from "../../../../domain/model/publisher/publisherId";

export default class PublisherUpdateOutputData {
  public publisherId: string;

  public constructor(publisherId: PublisherId) {
    this.publisherId = publisherId.Id;
  }
}
