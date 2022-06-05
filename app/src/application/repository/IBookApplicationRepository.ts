import BookModel from '../../domain/model/bookModel';
import TagModel from '../../domain/model/tagModel';

export interface IBookApplicationRepository {
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
  search (query: string, pageCount: number): Promise<BookModel[]>
  executeBulkApi (): Promise<void>
  searchById (id: string): Promise<BookModel>
  searchUsingLike(words: string, pageCount: number): Promise<BookModel[]>
  getTagsByBookId(bookId: string): Promise<TagModel[]>
  searchByTag(tagName: string, pageCount: number): Promise<BookModel[]>
  getTotalResults(searchWord: string, isStrict: boolean, isTag: boolean): Promise<number>
  update(bookModel: BookModel): Promise<void>
}
