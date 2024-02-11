import Author from "../../model/author/author";
import AuthorId from "../../model/author/authorId";
import PaginationMargin from "../../model/pagination/paginationMargin";

export interface IAuthorESRepository {
  search(query: string, pageCount: number, reqMargin: PaginationMargin, isLike: boolean): Promise<{ids: AuthorId[], total: number}>;
  update(author: Author): Promise<void>;
  deleteAuthors(ids: AuthorId[]): Promise<void>;
  save(author: Author): Promise<void>;
  saveMany(authors: Author[]): Promise<void>
}
