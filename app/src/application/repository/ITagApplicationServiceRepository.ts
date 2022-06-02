import TagModel from '../../domain/model/tagModel';

export interface ITagApplicationServiceRepository {
  createTag (tagModel: TagModel): Promise<void>
  findByName (name: string): Promise<TagModel | null>
  saveCombination(tagModel: TagModel, bookId: string): Promise<void>
  isExistCombination(tagId: string, bookId: string): Promise<boolean>
  findAll (): Promise<TagModel[]>
  delete(id: string): Promise<void>
  isExistTable(): Promise<boolean>
  deleteAll(): Promise<void>
}
