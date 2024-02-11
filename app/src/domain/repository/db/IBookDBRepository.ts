import AuthorId from "../../model/author/authorId";
import Book from "../../model/book/book";
import BookId from "../../model/book/bookId";
import PaginationMargin from "../../model/pagination/paginationMargin";
import PublisherId from "../../model/publisher/publisherId";
import Recommendation from "../../model/recommendation/recommendation";

export interface IBookDBRepository {
  findById(id: BookId): Promise<{book: Book, recommendations: Recommendation[]} | null>;
  searchByTag(tagName: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>;
  findByIds(ids: BookId[]): Promise<Book[]>;
  findByAuthorIds(ids: AuthorId[]): Promise<Book[]>;
  findByPublisherIds(ids: PublisherId[]): Promise<Book[]>;
  findAll(pageCount: number, margin: PaginationMargin): Promise<Book[]>;
  countAll(): Promise<number>;
  update(book: Book): Promise<void>;
  save(book: Book): Promise<void>;
  delete(book: Book): Promise<void>;
  deleteAll(): Promise<void>;
  saveMany(books: Book[]): Promise<void>;
  findDuplicateBookNames(): Promise<string[]>;
}
