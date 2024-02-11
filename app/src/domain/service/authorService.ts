import Author from "../model/author/author";

import {v4 as uuidv4} from "uuid";
import {IAuthorDBRepository} from "../repository/db/IAuthorDBRepository";

export default class AuthorService {
  private readonly authorRepository: IAuthorDBRepository;

  public constructor(authorRepository: IAuthorDBRepository) {
    this.authorRepository = authorRepository;
  }

  /**
   * 同じ名前の著者を検索する
   * @param author 著者オブジェクト
   * @returns 存在するか
   */
  public async isExist(author: Author): Promise<boolean> {
    if (author.Name === null) return false;
    const found = await this.authorRepository.findByName(author.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }
}
