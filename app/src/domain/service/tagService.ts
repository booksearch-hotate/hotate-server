import Tag from '../model/tag/tagModel';
import {ITagRepository} from '../model/tag/ITagRepository';

import {v4 as uuidv4} from 'uuid';

export default class TagService {
  private readonly tagRepository: ITagRepository;

  public constructor(tagRepository: ITagRepository) {
    this.tagRepository = tagRepository;
  }

  public async isExist(tag: Tag): Promise<boolean> {
    const found = await this.tagRepository.findByName(tag.Name);

    return found !== null;
  }

  public createUUID(): string {
    return uuidv4();
  }

  public async getCount(tag: Tag): Promise<number> {
    const count = await this.tagRepository.getCount(tag.Id);

    return count;
  }
}
