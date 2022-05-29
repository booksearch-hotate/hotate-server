import TagModel from '../model/tagModel';
import {ITagServiceRepository} from './repository/ITagServiceRepository';

import {v4 as uuidv4} from 'uuid';

export default class TagService {
  private readonly tagRepository: ITagServiceRepository;

  public constructor(tagRepository: ITagServiceRepository) {
    this.tagRepository = tagRepository;
  }

  public async isExist(tag: TagModel): Promise<boolean> {
    const found = await this.tagRepository.findByName(tag.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }
}
