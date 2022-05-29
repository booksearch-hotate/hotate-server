import TagModel from '../../model/tagModel';

export interface ITagServiceRepository {
  findByName (name: string): Promise<TagModel | null>
}
