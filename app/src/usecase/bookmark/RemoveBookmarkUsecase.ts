import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookmarkDBRepository} from "../../domain/repository/db/IBookmarkDBRepository";
import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import BookmarkRemoveInputData from "../../presentation/dto/bookmark/remove/BookmarkRemoveInputData";
import {Usecase} from "../Usecase";

export default class RemoveBookmarkUseCase implements Usecase<BookmarkRemoveInputData, Promise<void>> {
  private readonly bookmarkDB: IBookmarkDBRepository;
  private readonly userDB: IUserDBRepository;
  private readonly bookDB: IBookDBRepository;

  public constructor(
      bookmarkDB: IBookmarkDBRepository,
      userDB: IUserDBRepository,
      bookDB: IBookDBRepository,
  ) {
    this.bookmarkDB = bookmarkDB;
    this.userDB = userDB;
    this.bookDB = bookDB;
  }

  public async execute(input: BookmarkRemoveInputData): Promise<void> {
    const user = await this.userDB.findById(input.userId);

    if (user === null) throw new Error("ユーザが見つかりません。");

    const bookAndRecommendation = await this.bookDB.findById(input.bookId);

    if (bookAndRecommendation === null) throw new Error("本が見つかりません。");

    await this.bookmarkDB.remove(user, bookAndRecommendation.book);
  }
}
