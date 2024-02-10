import {IBookmarkDBRepository} from "../../domain/repository/db/IBookmarkDBRepository";
import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import BookmarkFindInputData from "../../presentation/dto/bookmark/find/BookmarkFindInputData";
import BookmarkFindOutputData from "../../presentation/dto/bookmark/find/BookmarkFindOutputData";
import {Usecase} from "../Usecase";

export default class FindBookmarkUsecase implements Usecase<BookmarkFindInputData, Promise<BookmarkFindOutputData>> {
  private readonly bookmarkDB: IBookmarkDBRepository;
  private readonly userDB: IUserDBRepository;

  public constructor(bookmarkDB: IBookmarkDBRepository, userDB: IUserDBRepository) {
    this.bookmarkDB = bookmarkDB;
    this.userDB = userDB;
  }

  public async execute(input: BookmarkFindInputData): Promise<BookmarkFindOutputData> {
    const user = await this.userDB.findById(input.userId);

    if (user === null) throw new Error("ユーザが見つかりません。");

    const books = await this.bookmarkDB.findByUser(user);

    return new BookmarkFindOutputData(books);
  }
}
