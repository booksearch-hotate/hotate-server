import Author from './author';

export interface IAuthorRepository {
  save (author: Author, isBulk: boolean): Promise<void>
  findByName (name: string | null): Promise<Author | null>
  deleteAll (): Promise<void>
  executeBulkApi (): Promise<void>
  findById(authorId: string): Promise<Author>
  deleteNoUsed(authorId: string): Promise<void>
  update(author: Author): Promise<void>
  search(name: string): Promise<Author[]>
  searchUsingLike(name: string): Promise<Author[]>
}
