import AuthorModel from '../../model/authorModel'

export default interface IAuthorDomainRepository {
  findByName (name: string | null): Promise<AuthorModel | null>
}
