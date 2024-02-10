import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookmarkDBRepository} from "../../domain/repository/db/IBookmarkDBRepository";
import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import BookmarkAddInputData from "../../presentation/dto/bookmark/add/BookmarkAddInputData";
import {Usecase} from "../Usecase";

export default class AddBookmarkUseCase implements Usecase<BookmarkAddInputData, Promise<void>> {
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

  public async execute(input: BookmarkAddInputData): Promise<void> {
    const user = await this.userDB.findById(input.userId);

    if (user === null) throw new Error("ユーザが見つかりませんでした。");

    const bookAndRecommendations = await this.bookDB.findById(input.bookId);

    if (bookAndRecommendations === null) throw new Error("本が見つかりませんでした。");

    const book = bookAndRecommendations.book;

    const alreadyBooks = await this.bookmarkDB.findByUser(user);
    if (alreadyBooks.includes(book)) throw new Error("すでに登録されています。");

    await this.bookmarkDB.add(user, book);
  }
}
