import Book from './bookModel';
import BookIdModel from './bookIdModel';
import Tag from '../tag/tagModel';
import PaginationMargin from '../pagination/paginationMarginModel';
import Author from '../author/authorModel';
import Publisher from '../publisher/publisherModel';

export interface IBookRepository {
  save (book: Book): Promise<void>
  deleteAll (): Promise<void>
  search (query: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}>
  executeBulkApi (): Promise<void>
  searchById (id: BookIdModel): Promise<Book>
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
