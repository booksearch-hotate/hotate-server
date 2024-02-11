import Publisher from "../../../domain/model/publisher/publisher";

export default class PublisherData {
  private id: string;
  private name!: string | null;

  public constructor(publisherModel: Publisher) {
    this.id = publisherModel.Id.Id;
    this.name = publisherModel.Name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }
}
