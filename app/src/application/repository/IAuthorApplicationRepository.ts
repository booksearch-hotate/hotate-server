import AuthorModel from '../../domain/model/authorModel';

export interface IAuthorApplicationRepository {
  save (author: AuthorModel): Promise<void>
  findByName (name: string | null): Promise<AuthorModel | null>
  deleteAll (): Promise<void>
}
