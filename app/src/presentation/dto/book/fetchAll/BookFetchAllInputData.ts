import PaginationMargin from "../../../../domain/model/pagination/paginationMargin";

export default class BookFetchAllInputData {
  public pageCount: number;
  public margin: PaginationMargin;

  public constructor(
      pageCount: number,
      reqMargin: number,
  ) {
    this.pageCount = pageCount;
    this.margin = new PaginationMargin(reqMargin);
  }
}
