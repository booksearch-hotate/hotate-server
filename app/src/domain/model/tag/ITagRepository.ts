import Tag from './tagModel';

export interface ITagRepository {
  createTag (tagModel: Tag): Promise<void>
  findByName (name: string): Promise<Tag | null>
  saveCombination(tagModel: Tag, bookId: string): Promise<void>
  isExistCombination(tagId: string, bookId: string): Promise<boolean>
  findAll (): Promise<Tag[]>
  delete(tag: Tag): Promise<void>
  isExistTable(): Promise<boolean>
  deleteAll(): Promise<void>
  findById(id: string): Promise<Tag | null>
  update(tag: Tag): Promise<void>
  getCount (tagId: string): Promise<number>
}
