import AuthorModel from "../../model/authorModel"

export default interface IAuthorDomainRepository {
  findByName (name: string): Promise<AuthorModel | null>
}
