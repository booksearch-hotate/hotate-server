import Book from "../../model/book/book";
import BookId from "../../model/book/bookId";
import PaginationMargin from "../../model/pagination/paginationMargin";

export interface IBookESRepository {
  search(query: string, pageCount: number, reqMargin: PaginationMargin, isLike: boolean): Promise<{ids: BookId[], total: number}>;
  update(book: Book): Promise<void>;
  save(book: Book): Promise<void>;
  delete(book: Book): Promise<void>;
  deleteAll(): Promise<void>;
  saveMany(books: Book[]): Promise<void>;
  findByDBIds(ids: string[]): Promise<string[]>;
  count(): Promise<number>;
  getIds(pageCount: number, reqMargin: PaginationMargin): Promise<BookId[]>;
  deleteMany(book: string[]): Promise<void>;
}
