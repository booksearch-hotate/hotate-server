import Author from "../../domain/model/author/author";
import AuthorId from "../../domain/model/author/authorId";
import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IAuthorESRepository} from "../../domain/repository/es/IAuthorESRepository";
import AuthorService from "../../domain/service/authorService";
import AuthorSaveManyInputData from "../../presentation/dto/author/saveMany/AuthorSaveManyInputData";
import AuthorSaveManyOutputData from "../../presentation/dto/author/saveMany/AuthorSaveManyOutputData";
import {Usecase} from "../Usecase";

export default class SaveManyAuthorsUsecase implements Usecase<AuthorSaveManyInputData, Promise<AuthorSaveManyOutputData>> {
  private readonly authorDB: IAuthorDBRepository;
  private readonly authorES: IAuthorESRepository;
  private readonly authorService: AuthorService;

  public constructor(
      authorDB: IAuthorDBRepository,
      authorES: IAuthorESRepository,
      authorService: AuthorService,
  ) {
    this.authorDB = authorDB;
    this.authorES = authorES;
    this.authorService = authorService;
  }

  public async execute(input: AuthorSaveManyInputData): Promise<AuthorSaveManyOutputData> {
    const authors: Author[] = [];
    const isAlreadyList: Author[] = [];

    // 同名がいた場合は登録しない
    for (const name of input.names) {
      const author = new Author(new AuthorId(null), name);

      if (await this.authorService.isExist(author) && author.Name !== null) {
        const alreadyAuthor = await this.authorDB.findByName(author.Name);
        if (alreadyAuthor === null) throw new Error("Author not found");

        isAlreadyList.push(alreadyAuthor);
      } else {
        authors.push(author);
      }
    }

    await Promise.all([this.authorDB.saveMany(authors), this.authorES.saveMany(authors)]);

    return new AuthorSaveManyOutputData(authors.concat(isAlreadyList));
  }
}
