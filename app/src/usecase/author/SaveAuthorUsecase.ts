import Author from "../../domain/model/author/author";
import AuthorId from "../../domain/model/author/authorId";
import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IAuthorESRepository} from "../../domain/repository/es/IAuthorESRepository";
import AuthorService from "../../domain/service/authorService";
import AuthorSaveInputData from "../../presentation/dto/author/save/AuthorSaveInputData";
import AuthorSaveOutputData from "../../presentation/dto/author/save/AuthorSaveOutputData";
import {Usecase} from "../Usecase";

export default class SaveAuthorUseCase implements Usecase<AuthorSaveInputData, Promise<AuthorSaveOutputData>> {
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

  public async execute(input: AuthorSaveInputData): Promise<AuthorSaveOutputData> {
    let author = new Author(
        new AuthorId(null),
        input.name,
    );

    if (await this.authorService.isExist(author)) {
      const findAuthor = await this.authorDB.findByName(input.name);

      if (findAuthor === null) throw new Error("同名の著者は存在しますが、DBに登録されていませんでした。");

      author = findAuthor;
    } else {
      await Promise.all([
        this.authorDB.save(author),
        this.authorES.save(author),
      ]);
    }

    return new AuthorSaveOutputData(author.Id);
  }
}
