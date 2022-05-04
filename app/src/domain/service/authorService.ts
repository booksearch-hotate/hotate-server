import AuthorModel from "../model/authorModel"
import IAuthorDomainRepository from "./repository/IAuthorDomainRepository"

export default class AuthorService {
  private readonly authorRepository: IAuthorDomainRepository

  public constructor (authorRepository: IAuthorDomainRepository) {
    this.authorRepository = authorRepository
  }

  /**
   * 同じ名前の著者を検索する
   * @param author 著者オブジェクト
   * @returns 存在するか
   */
  public async isExist (author: AuthorModel): Promise<boolean> {
    const found = await this.authorRepository.findByName(author.Name)
    return found !== null
  }
}
