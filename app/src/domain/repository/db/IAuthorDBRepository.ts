import Author from "../../model/author/author";
import AuthorId from "../../model/author/authorId";

export interface IAuthorDBRepository {
  save(author: Author): Promise<void>
  update(author: Author): Promise<void>
  findById(authorId: AuthorId): Promise<Author | null>
  findByName(name: string): Promise<Author | null>
  findNotUsed(): Promise<Author[]>
  delete(authorId: AuthorId): Promise<void>
  deleteAuthors(authorIds: AuthorId[]): Promise<void>
  saveMany(authors: Author[]): Promise<void>
}
