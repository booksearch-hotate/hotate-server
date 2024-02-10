import BookSearchInputData from "../presentation/dto/book/searchBooks/BookSearchInputData";
import SearchHistoryAddInputData from "../presentation/dto/searchHistory/add/SearchHistoryAddInputData";
import SearchHistorySearchInputData from "../presentation/dto/searchHistory/search/SearchHistorySearchInputData";
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
      const input = new SearchHistorySearchInputData(query);
      const output = await this.searchHistoryUseCase.execute(input);

      const bookSearchInput = new BookSearchInputData(query, searchMode, searchCategory, pageCount, reqMargin);
      const bookSearchOutput = await this.searchBooksUsecase.execute(bookSearchInput);

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
