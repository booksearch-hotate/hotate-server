import {IAuthorApplicationRepository} from './repository/IAuthorApplicationRepository';
import AuthorModel from '../domain/model/authorModel';
import AuthorService from '../domain/service/authorService';

export default class AuthorApplicationService {
  private readonly authorRepository: IAuthorApplicationRepository;
  private readonly authorService: AuthorService;

  public constructor(authorRepository: IAuthorApplicationRepository, authorService: AuthorService) {
    this.authorRepository = authorRepository;
    this.authorService = authorService;
  }

  public async createAuthor(name: string): Promise<string> {
    const author = new AuthorModel(this.authorService.createUUID(), name);
    let id;
    if (await this.authorService.isExist(author)) {
      const found = await this.authorRepository.findByName(author.Name);
      if (found === null) throw new Error('Author not found');
      id = found.Id;
    } else {
      await this.authorRepository.save(author);
      id = author.Id;
    }
    return id;
  }

  public async deleteAuthors(): Promise<void> {
    await this.authorRepository.deleteAll();
  }

  public async executeBulkApi(): Promise<void> {
    await this.authorRepository.executeBulkApi();
  }
}
