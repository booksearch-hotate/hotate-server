import Book from '../book/book';
import User from '../user/user';

export default class Bookmark {
  private id: number;
  private books: Book[];
  private user: User;

  public constructor(id: number, books: Book[], user: User) {
    this.id = id;
    this.books = books;
    this.user = user;
  }
}
