import Book from '../model/book/book';
import User from '../model/user/user';

export interface IBookmarkRepository {
  save(user: User, book: Book): Promise<void>;
  isAlreadyBookmarked(user: User, book: Book): Promise<boolean>;
  getBookmarksByUserId(userId: number): Promise<Book[]>;
  delete(user: User, book: Book): Promise<void>;
}
