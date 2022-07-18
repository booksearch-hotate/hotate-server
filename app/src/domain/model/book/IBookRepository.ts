import BookModel from './bookModel';
import bookIdModel from './bookIdModel';
import TagModel from '../tag/tagModel';

export interface IBookRepository {
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
  search (query: string, pageCount: number): Promise<BookModel[]>
  executeBulkApi (): Promise<void>
  searchById (id: bookIdModel): Promise<BookModel>
  searchUsingLike (words: string, pageCount: number): Promise<BookModel[]>
  getTagsByBookId (bookId: string): Promise<TagModel[]>
  searchByTag (tagName: string, pageCount: number): Promise<BookModel[]>
  latestEsTotalCount (): number
  getCountUsingTag (searchWord: string): Promise<number>
  update (bookModel: BookModel): Promise<void>
  findAll (pageCount: number): Promise<BookModel[]>
  findAllCount (): Promise<number>
  deleteBook (book: BookModel): Promise<void>
}
