import Publisher from "../../model/publisher/publisher";
import PublisherId from "../../model/publisher/publisherId";

export interface IPublisherDBRepository {
  findById(id: PublisherId): Promise<Publisher | null>;
  findByName(name: string): Promise<Publisher | null>;
  update(publisher: Publisher): Promise<void>;
  findNotUsed(): Promise<Publisher[]>;
  deletePublishers(ids: PublisherId[]): Promise<void>;
  save(publisher: Publisher): Promise<void>;
  saveMany(publishers: Publisher[]): Promise<void>;
}
