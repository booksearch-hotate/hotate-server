import {IAuthorRepository} from '../domain/model/author/IAuthorRepository';
import Author from '../domain/model/author/author';
import AuthorService from '../domain/service/authorService';

import AuthorData from '../domain/model/author/authorData';

export default class AuthorApplicationService {
  private readonly authorRepository: IAuthorRepository;
  private readonly authorService: AuthorService;

  public constructor(authorRepository: IAuthorRepository, authorService: AuthorService) {
    this.authorRepository = authorRepository;
    this.authorService = authorService;
  }

  public async createAuthor(name: string, isBulk: boolean): Promise<string> {
    const author = new Author(this.authorService.createUUID(), name);
    let id;
    if (await this.authorService.isExist(author)) {
      const found = await this.authorRepository.findByName(author.Name);
      if (found === null) throw new Error('Author not found');
      id = found.Id;
    } else {
      await this.authorRepository.save(author, isBulk);
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

  public async findById(authorId: string): Promise<AuthorData> {
    const author = await this.authorRepository.findById(authorId);
    return new AuthorData(author);
  }

  public async deleteNotUsed(authorId: string): Promise<void> {
    await this.authorRepository.deleteNoUsed(authorId);
  }

  public async update(authorId: string, name: string): Promise<void> {
    const author = await this.authorRepository.findById(authorId);

    author.changeName(name);

    await this.authorRepository.update(author);
  }
}
