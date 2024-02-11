import PublisherId from "../../../../domain/model/publisher/publisherId";

export default class PublisherUpdateInputData {
  public id: PublisherId;
  public name: string;

  public constructor(
      id: string,
      name: string,
  ) {
    this.id = new PublisherId(id);
    this.name = name;
  }
}
