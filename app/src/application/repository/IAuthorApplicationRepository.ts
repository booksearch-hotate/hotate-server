import AuthorModel from "../../domain/model/authorModel"

export default interface IAuthorApplicationRepository {
  getMaximumId (): Promise<number>
  save (author: AuthorModel): Promise<void>
  findByName (name: string): Promise<AuthorModel | null>
  deleteAll (): Promise<void>
}
