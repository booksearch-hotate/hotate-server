import BookmarkAddInputData from "../presentation/dto/bookmark/add/BookmarkAddInputData";
import BookmarkFindInputData from "../presentation/dto/bookmark/find/BookmarkFindInputData";
import BookmarkAddResponse from "../presentation/response/bookmark/BookmarkAddResponse";
import BookmarkFindResponse from "../presentation/response/bookmark/BookmarkFindResponse";
import BookmarkRemoveResponse from "../presentation/response/bookmark/BookmarkRemoveResponse";
import AddBookmarkUseCase from "../usecase/bookmark/AddBookmarkUsecase";
import FindBookmarkUsecase from "../usecase/bookmark/FindBookmarkUsecase";
import RemoveBookmarkUseCase from "../usecase/bookmark/RemoveBookmarkUsecase";

export default class BookmarkController {
  private readonly addBookmarkUseCase: AddBookmarkUseCase;
  private readonly findBookmarkUseCase: FindBookmarkUsecase;
  private readonly removeBookmarkUseCase: RemoveBookmarkUseCase;

  public constructor(
      addBookmarkUseCase: AddBookmarkUseCase,
      findBookmarkUseCase: FindBookmarkUsecase,
      removeBookmarkUseCase: RemoveBookmarkUseCase,
  ) {
    this.addBookmarkUseCase = addBookmarkUseCase;
    this.findBookmarkUseCase = findBookmarkUseCase;
    this.removeBookmarkUseCase = removeBookmarkUseCase;
  }

  public async add(userId: number, bookId: string): Promise<BookmarkAddResponse> {
    const response = new BookmarkAddResponse();

    try {
      const input = new BookmarkAddInputData(bookId, userId);

      await this.addBookmarkUseCase.execute(input);
      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async remove(userId: number, bookId: string): Promise<BookmarkRemoveResponse> {
    const response = new BookmarkRemoveResponse();

    try {
      const input = new BookmarkAddInputData(bookId, userId);

      await this.removeBookmarkUseCase.execute(input);
      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async findByUserId(userId: number): Promise<BookmarkFindResponse> {
    const response = new BookmarkFindResponse();

    try {
      const input = new BookmarkFindInputData(userId);
      const bookmarks = await this.findBookmarkUseCase.execute(input);
      return response.success(bookmarks);
    } catch (e) {
      return response.error();
    }
  }
}
