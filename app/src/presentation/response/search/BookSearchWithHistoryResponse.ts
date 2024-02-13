import BookData from "../../dto/book/BookData";
import BookSearchOutputData from "../../dto/book/searchBooks/BookSearchOutputData";
import SearchHistorySearchOutputData from "../../dto/searchHistory/search/SearchHistorySearchOutputData";
import SearchHistoryData from "../../dto/searchHistory/searchHistoryData";
import TreeResponse from "../TreeResponse";

export type SearchHistoryControllerOutputData = {
  searchHistoryList: SearchHistorySearchOutputData;
  searchBooksList: BookSearchOutputData;
};

export class BookSearchWithHistoryResponse extends TreeResponse<SearchHistoryControllerOutputData> {
  public searchHistoryList: SearchHistoryData[] = [];
  public searchBooksList: BookData[] = [];
  public count: number | null = null;

  public success(o: SearchHistoryControllerOutputData) {
    this.searchHistoryList = o.searchHistoryList.searchHistoryList;
    this.searchBooksList = o.searchBooksList.books;
    this.count = o.searchBooksList.count;
    return this;
  }

  public error() {
    return this;
  }
}
