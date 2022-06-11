import AuthorModel from '../../domain/model/authorModel';

export interface IAuthorApplicationRepository {
  save (author: AuthorModel, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<AuthorModel | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  findById(bookId: string): Promise<AuthorModel>
  deleteNoUsed(authorId: string): Promise<void>
}
