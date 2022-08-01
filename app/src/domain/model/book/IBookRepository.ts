import Book from './book';
import BookId from './bookId';
import Tag from '../tag/tag';
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
  getTagsByBookId (bookId: string): Promise<Tag[]>
  searchByTag (tagName: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  latestEsTotalCount (): number
  getCountUsingTag (searchWord: string): Promise<number>
  update (bookModel: Book): Promise<void>
  findAll (pageCount: number, marign: PaginationMargin): Promise<Book[]>
  findAllCount (): Promise<number>
  deleteBook (book: Book): Promise<void>
  searchByForeignId(foreignModel: Author[] | Publisher[], pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
}
