import Book from "../../model/book/book";
import User from "../../model/user/user";

export interface IBookmarkDBRepository {
  add(user: User, book: Book): Promise<void>;
  findByUser(user: User): Promise<Book[]>;
  remove(user: User, book: Book): Promise<void>;
}
