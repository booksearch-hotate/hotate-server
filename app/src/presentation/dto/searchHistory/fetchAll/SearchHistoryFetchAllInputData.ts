import PaginationMargin from "../../../../domain/model/pagination/paginationMargin";

export default class SearchHistoryFetchAllInputData {
  public pageCount: number;
  public fetchMargin: PaginationMargin;

  public constructor(pageCount: number, fetchMargin: number) {
    this.pageCount = pageCount;
    this.fetchMargin = new PaginationMargin(fetchMargin);
  }
}
