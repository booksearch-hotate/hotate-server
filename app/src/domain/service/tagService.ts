import Tag from "../model/tag/tag";

import {v4 as uuidv4} from "uuid";
import {ITagDBRepository} from "../repository/db/ITagDBRepository";

export default class TagService {
  private readonly tagRepository: ITagDBRepository;

  public constructor(tagRepository: ITagDBRepository) {
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
    return await this.tagRepository.countById(tag.Id);
  }
}
