import TagModel from '../../domain/model/tagModel';

export interface ITagApplicationServiceRepository {
  createTag (tagModel: TagModel): Promise<void>
  findByName (name: string): Promise<TagModel | null>
  saveCombination(tagModel: TagModel, bookId: string): Promise<void>
  isExistCombination(tagId: string, bookId: string): Promise<boolean>
  findAll (): Promise<[TagModel, number][]>
  delete(id: string): Promise<void>
  isExistTable(): Promise<boolean>
  deleteAll(): Promise<void>
  findById(id: string): Promise<TagModel | null>
  update(id: string, name: string): Promise<void>
}
