import AuthorModel from '../../model/authorModel';

export interface IAuthorDomainRepository {
  findByName (name: string | null): Promise<AuthorModel | null>
};
