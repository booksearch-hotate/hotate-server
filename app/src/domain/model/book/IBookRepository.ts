import BookModel from './bookModel';
import BookIdModel from './bookIdModel';
import TagModel from '../tag/tagModel';
import PaginationMarginModel from '../pagination/paginationMarginModel';
import AuthorModel from '../author/authorModel';
import PublisherModel from '../publisher/publisherModel';

export interface IBookRepository {
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
  search (query: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}>
  executeBulkApi (): Promise<void>
  searchById (id: BookIdModel): Promise<BookModel>
  searchUsingLike (words: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}>
  getTagsByBookId (bookId: string): Promise<TagModel[]>
  searchByTag (tagName: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}>
  latestEsTotalCount (): number
  getCountUsingTag (searchWord: string): Promise<number>
  update (bookModel: BookModel): Promise<void>
  findAll (pageCount: number, marign: PaginationMarginModel): Promise<BookModel[]>
  findAllCount (): Promise<number>
  deleteBook (book: BookModel): Promise<void>
  searchByForeignId(foreignModel: AuthorModel[] | PublisherModel[], pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}>
}
