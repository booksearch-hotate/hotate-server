import Publisher from "../../../../domain/model/publisher/publisher";
import PublisherData from "../publisherData";

export default class PublisherSaveManyOutputData {
  public dataList: PublisherData[];

  public constructor(publishers: Publisher[]) {
    this.dataList = publishers.map((publisher) => new PublisherData(publisher));
  }
}
