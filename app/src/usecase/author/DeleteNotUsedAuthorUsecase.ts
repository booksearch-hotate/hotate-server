import {IAuthorDBRepository} from "../../domain/repository/db/IAuthorDBRepository";
import {IAuthorESRepository} from "../../domain/repository/es/IAuthorESRepository";
import {Usecase} from "../Usecase";

export default class DeleteNotUsedAuthorUseCase implements Usecase<void, Promise<void>> {
  private readonly authorDB: IAuthorDBRepository;
  private readonly authorES: IAuthorESRepository;

  public constructor(authorDB: IAuthorDBRepository, authorES: IAuthorESRepository) {
    this.authorDB = authorDB;
    this.authorES = authorES;
  }

  public async execute(): Promise<void> {
    const authors = await this.authorDB.findNotUsed();

    await Promise.all([
      this.authorDB.deleteAuthors(authors.map((author) => author.Id)),
      this.authorES.deleteAuthors(authors.map((author) => author.Id)),
    ]);
  }
}
