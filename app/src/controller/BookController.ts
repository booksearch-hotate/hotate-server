import BookFetchInputData from "../presentation/dto/book/fetchBook/BookFetchInputData";
import IsAlreadyBookmarkResponse from "../presentation/dto/book/isAlreadyBookmark/IsAlreadyBookmarkResponse";
import BookSearchInputData from "../presentation/dto/book/searchBooks/BookSearchInputData";
import BookmarkFindInputData from "../presentation/dto/bookmark/find/BookmarkFindInputData";
import FetchBookResponse from "../presentation/response/book/FetchBookResponse";
import FetchBookUsecase from "../usecase/book/FetchBookUsecase";
import SearchBooksUsecase from "../usecase/book/SearchBooksUsecase";
import FindBookmarkUsecase from "../usecase/bookmark/FindBookmarkUsecase";

export default class BookController {
  private readonly fetchBookUsecase: FetchBookUsecase;
  private readonly searchBooksUsecase: SearchBooksUsecase;
  private readonly findBookmarkUsecase: FindBookmarkUsecase;

  public constructor(
      fetchBookUsecase: FetchBookUsecase,
      searchBooksUsecase: SearchBooksUsecase,
      findBookmarkUsecase: FindBookmarkUsecase,
  ) {
    this.fetchBookUsecase = fetchBookUsecase;
    this.searchBooksUsecase = searchBooksUsecase;
    this.findBookmarkUsecase = findBookmarkUsecase;
  }

  public async fetchBook(bookId: string): Promise<FetchBookResponse> {
    const response = new FetchBookResponse();

    try {
      const input = new BookFetchInputData(bookId);
      const output = await this.fetchBookUsecase.execute(input);

      const nearCategoryBooks = await this.searchBooksUsecase.execute(
          new BookSearchInputData(
              output.book.BookName,
              "none",
              "book",
              0,
              9,
          ),
      );

      return response.success({
        book: output,
        nearCategoryBooks: nearCategoryBooks,
      });
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async isAlreadyBookmark(bookId: string, userId: number): Promise<IsAlreadyBookmarkResponse> {
    const response = new IsAlreadyBookmarkResponse();
    try {
      const bookInput = new BookFetchInputData(bookId);
      await this.fetchBookUsecase.execute(bookInput); // 本が存在するか確認

      const bookmarkInput = new BookmarkFindInputData(userId);
      const bookmarkOutput = await this.findBookmarkUsecase.execute(bookmarkInput);

      if (bookmarkOutput.books.some((book) => book.Id === bookId)) return response.success(true);
      return response.success(false);
    } catch (e) {
      return response.error(e as Error);
    }
  }
}
