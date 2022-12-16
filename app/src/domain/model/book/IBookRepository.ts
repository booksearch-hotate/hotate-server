import Book from './book';
import BookId from './bookId';
import PaginationMargin from '../pagination/paginationMargin';
import Author from '../author/author';
import Publisher from '../publisher/publisher';

export interface IBookRepository {
  save (book: Book): Promise<void>
  deleteAll (): Promise<void>
  search (query: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  executeBulkApi (): Promise<void>
  searchById (id: BookId): Promise<Book>
  searchUsingLike (words: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  searchByTag (tagName: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  update (bookModel: Book): Promise<void>
  findAll (pageCount: number, marign: PaginationMargin): Promise<Book[]>
  findAllCount (): Promise<number>
  deleteBook (book: Book): Promise<void>
  searchByForeignId(foreignModel: Author[] | Publisher[], pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  getDuplicationBooks(): Promise<string[]>
  checkEqualDbAndEs(): Promise<string[]>
}
