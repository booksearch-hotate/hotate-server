import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IAuthorESRepository} from "../../domain/repository/es/IAuthorESRepository";
import AuthorService from "../../domain/service/authorService";
import AuthorUpdateInputData from "../../presentation/dto/author/update/AuthorUpdateInputData";
import AuthorUpdateOutputData from "../../presentation/dto/author/update/AuthorUpdateOutputData";
import {Usecase} from "../Usecase";

export default class UpdateAuthorUsecase implements Usecase<AuthorUpdateInputData, Promise<AuthorUpdateOutputData>> {
  private authorDB: IAuthorDBRepository;
  private authorES: IAuthorESRepository;

  private authorService: AuthorService;

  public constructor(
      authorDB: IAuthorDBRepository,
      authorES: IAuthorESRepository,
      authorService: AuthorService,
  ) {
    this.authorDB = authorDB;
    this.authorES = authorES;
    this.authorService = authorService;
  }

  public async execute(input: AuthorUpdateInputData): Promise<AuthorUpdateOutputData> {
    let author = await this.authorDB.findById(input.id);

    if (author === null) throw new Error("著者が見つかりませんでした。");

    author.changeName(input.name);

    if (await this.authorService.isExist(author) && author.Name !== null) {
      author = await this.authorDB.findByName(author.Name); // 既に登録されている著者の情報を取得

      if (author === null) throw new Error("著者が見つかりませんでした。");
    } else {
      await Promise.all([await this.authorDB.update(author), await this.authorES.update(author)]);
    }

    return new AuthorUpdateOutputData(author.Id);
  }
}
