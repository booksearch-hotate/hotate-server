import SearchHistory from "../../../../domain/model/searchHistory/searchHistory";
import SearchHistoryData from "../searchHistoryData";

export default class SearchHistoryFetchAllOutputData {
  public dataList: SearchHistoryData[];
  public total: number;

  public constructor(histories: SearchHistory[], total: number) {
    this.dataList = histories.map((history) => new SearchHistoryData(history));
    this.total = total;
  }
}
