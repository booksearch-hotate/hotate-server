import AuthorModel from './authorModel';

export interface IAuthorRepository {
  save (author: AuthorModel, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<AuthorModel | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  findById(bookId: string): Promise<AuthorModel>
  deleteNoUsed(authorId: string): Promise<void>
  update(author: AuthorModel): Promise<void>
}
