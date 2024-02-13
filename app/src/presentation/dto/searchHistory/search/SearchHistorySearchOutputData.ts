import SearchHistory from "../../../../domain/model/searchHistory/searchHistory";
import SearchHistoryData from "../searchHistoryData";

export default class SearchHistorySearchOutputData {
  public searchHistoryList: SearchHistoryData[] = [];

  public constructor(searchHistoryList: SearchHistory[]) {
    searchHistoryList.forEach((searchHistory) => {
      this.searchHistoryList.push(new SearchHistoryData(searchHistory));
    });
  }
}
