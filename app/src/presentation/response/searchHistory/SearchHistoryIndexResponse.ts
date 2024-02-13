import SearchHistoryFetchAllOutputData from "../../dto/searchHistory/fetchAll/SearchHistoryFetchAllOutputData";
import SearchHistoryData from "../../dto/searchHistory/searchHistoryData";
import TreeResponse from "../TreeResponse";

export default class SearchHistoryIndexResponse extends TreeResponse<SearchHistoryFetchAllOutputData> {
  public searchHistory: SearchHistoryData[] = [];
  public total: number | null = null;

  public success(o: SearchHistoryFetchAllOutputData) {
    this.searchHistory = o.dataList;
    this.total = o.total;

    return this;
  }

  public error() {
    return this;
  }
}
