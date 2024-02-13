import PaginationMargin from "../../../../domain/model/pagination/paginationMargin";
import searchCategory from "../../../../routers/datas/searchCategoryType";
import searchMode from "../../../../routers/datas/searchModeType";

export default class BookSearchInputData {
  public query: string;
  public searchMode: searchMode;
  public searchCategory: searchCategory;
  public pageCount: number;
  public margin: PaginationMargin;

  public constructor(
      query: string,
      searchMode: searchMode,
      searchCategory: searchCategory,
      pageCount: number,
      reqMargin: number,
  ) {
    this.query = query;
    this.searchMode = searchMode;
    this.searchCategory = searchCategory;
    this.pageCount = pageCount;
    this.margin = new PaginationMargin(reqMargin);
  }
}
