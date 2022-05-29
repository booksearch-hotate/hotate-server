import TagModel from '../../domain/model/tagModel';

export interface ITagApplicationServiceRepository {
  createTag (tagModel: TagModel): Promise<void>
  findByName (name: string): Promise<TagModel | null>
  saveCombination(tagModel: TagModel, bookId: string): Promise<void>
  isExistCombination(tagId: string, bookId: string): Promise<boolean>
}
