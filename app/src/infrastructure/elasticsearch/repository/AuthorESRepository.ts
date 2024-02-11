import Author from "../../../domain/model/author/author";
import AuthorId from "../../../domain/model/author/authorId";
import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import {IAuthorESRepository} from "../../../domain/repository/es/IAuthorESRepository";
import {IEsAuthor} from "../documents/IEsAuthor";
import EsAuthor from "../esAuthor";

export default class AuthorESRepository implements IAuthorESRepository {
  private readonly esAuthor: EsAuthor;

  public constructor(esAuthor: EsAuthor) {
    this.esAuthor = esAuthor;
  }

  public async search(
      query: string,
      pageCount: number,
      reqMargin: PaginationMargin,
      isLike: boolean,
  ): Promise<{ ids: AuthorId[]; total: number; }> {
    const data = await this.esAuthor.searchAuthor(query, pageCount, reqMargin, isLike);

    return {
      ids: data.ids.map((id) => new AuthorId(id)),
      total: data.total,
    };
  }

  public async update(author: Author): Promise<void> {
    const data: IEsAuthor = {
      db_id: author.Id.Id,
      name: author.Name,
    };
    await this.esAuthor.update(data);
  }

  public async deleteAuthors(ids: AuthorId[]): Promise<void> {
    await this.esAuthor.deleteByIds(ids.map((id) => id.Id));
  }

  public async save(author: Author): Promise<void> {
    const data: IEsAuthor = {
      db_id: author.Id.Id,
      name: author.Name,
    };
    await this.esAuthor.create(data);
  }

  public async saveMany(authors: Author[]): Promise<void> {
    this.esAuthor.createBulkApiFile();

    authors.forEach((author) => {
      const data: IEsAuthor = {
        db_id: author.Id.Id,
        name: author.Name,
      };
      this.esAuthor.insertBulk(data);
    });

    await this.esAuthor.executeBulkApi();

    this.esAuthor.removeBulkApiFile();
  }
}
