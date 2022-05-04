import IAuthorRepository from "../repository/author/IAuthorRepository"
import AuthorModel from "../domain/model/authorModel"
import AuthorService from "../domain/service/authorService"

export default class AuthorApplicationService {
  private readonly authorRepository: IAuthorRepository
  private readonly authorService: AuthorService

  public constructor (authorRepository: IAuthorRepository) {
    this.authorRepository = authorRepository
    this.authorService = new AuthorService(authorRepository)
  }

  public async createAuthor (name: string): Promise<number> {
    const author = new AuthorModel(await this.authorRepository.getMaximumId() + 1, name)
    let id
    if (await this.authorService.isExist(author)) {
      const found = await this.authorRepository.findByName(author.Name)
      if (found === null) throw new Error("Author not found")
      id = found.Id
    } else {
      await this.authorRepository.save(author)
      id = author.Id
    }
    return id
  }

  public async deleteAuthors (): Promise<void> {
    await this.authorRepository.deleteAll()
  }
}
