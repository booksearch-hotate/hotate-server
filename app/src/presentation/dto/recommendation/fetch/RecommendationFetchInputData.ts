import PaginationMargin from "../../../../domain/model/pagination/paginationMargin";

export default class RecommendationFetchInputData {
  public pageCount: number;
  public count: PaginationMargin;

  public constructor(pageCount: number, count: number) {
    this.pageCount = pageCount;
    this.count = new PaginationMargin(count);
  }
}
