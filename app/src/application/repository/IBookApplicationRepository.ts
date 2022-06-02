import BookModel from '../../domain/model/bookModel';
import TagModel from '../../domain/model/tagModel';

export interface IBookApplicationRepository {
  save (book: BookModel): Promise<void>
  deleteAll (): Promise<void>
  search (query: string): Promise<BookModel[]>
  executeBulkApi (): Promise<void>
  searchById (id: string): Promise<BookModel>
  searchUsingLike(words: string): Promise<BookModel[]>
  getTagsByBookId(bookId: string): Promise<TagModel[]>
  searchByTag(tagName: string): Promise<BookModel[]>
}
