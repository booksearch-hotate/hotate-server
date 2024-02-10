import PaginationMargin from "../../model/pagination/paginationMargin";
import Publisher from "../../model/publisher/publisher";
import PublisherId from "../../model/publisher/publisherId";

export interface IPublisherESRepository {
  search(query: string, pageCount: number, reqMargin: PaginationMargin, isLike: boolean): Promise<{ids: PublisherId[], total: number}>;
  update(publisher: Publisher): Promise<void>;
  deletePublishers(ids: PublisherId[]): Promise<void>;
  save(publisher: Publisher): Promise<void>;
  saveMany(publishers: Publisher[]): Promise<void>;
}
