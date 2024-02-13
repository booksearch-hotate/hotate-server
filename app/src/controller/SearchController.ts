import BookSearchInputData from "../presentation/dto/book/searchBooks/BookSearchInputData";
import SearchHistoryAddInputData from "../presentation/dto/searchHistory/add/SearchHistoryAddInputData";
import SearchHistorySearchInputData from "../presentation/dto/searchHistory/search/SearchHistorySearchInputData";
import SearchHistorySearchOutputData from "../presentation/dto/searchHistory/search/SearchHistorySearchOutputData";
import {BookSearchWithHistoryResponse} from "../presentation/response/search/BookSearchWithHistoryResponse";
import searchCategory from "../routers/datas/searchCategoryType";
import searchMode from "../routers/datas/searchModeType";
import SearchBooksUsecase from "../usecase/book/SearchBooksUsecase";
import AddSearchHistoryUseCase from "../usecase/searchHistory/AddSearchHistoryUsecase";
import SearchHistoryUseCase from "../usecase/searchHistory/SearchHistoryUsecase";

export default class SearchController {
  private readonly searchHistoryUseCase: SearchHistoryUseCase;
  private readonly searchBooksUsecase: SearchBooksUsecase;
  private readonly addSearchHistoryUseCase: AddSearchHistoryUseCase;

  public constructor(
      searchHistoryUseCase: SearchHistoryUseCase,
      searchBooksUsecase: SearchBooksUsecase,
      addSearchHistoryUseCase: AddSearchHistoryUseCase,
  ) {
    this.searchHistoryUseCase = searchHistoryUseCase;
    this.searchBooksUsecase = searchBooksUsecase;
    this.addSearchHistoryUseCase = addSearchHistoryUseCase;
  }

  public async search(
      query: string,
      searchMode: searchMode,
      searchCategory: searchCategory,
      pageCount: number,
      reqMargin: number,
  ): Promise<BookSearchWithHistoryResponse> {
    const res = new BookSearchWithHistoryResponse();
    try {
      const bookSearchInput = new BookSearchInputData(query, searchMode, searchCategory, pageCount, reqMargin);
      const bookSearchOutput = await this.searchBooksUsecase.execute(bookSearchInput);

      /* 検索結果がない検索ワードに関しては検索履歴に残さない */
      let output = new SearchHistorySearchOutputData([]);

      if (bookSearchOutput.books.length !== 0) {
        const input = new SearchHistorySearchInputData(query);
        output = await this.searchHistoryUseCase.execute(input);
      }

      return res.success({
        searchHistoryList: output,
        searchBooksList: bookSearchOutput,
      });
    } catch (e) {
      return res.error();
    }
  }

  public async addSearchHistory(word: string): Promise<void> {
    const input = new SearchHistoryAddInputData(word);

    await this.addSearchHistoryUseCase.execute(input);
  }
}
