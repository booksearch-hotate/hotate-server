import TagModel from '../domain/model/tagModel';

import TagService from '../domain/service/tagService';

import {ITagApplicationServiceRepository} from './repository/ITagApplicationServiceRepository';

export default class TagApplicationService {
  private readonly tagApplicationServiceRepository: ITagApplicationServiceRepository;
  private readonly tagService: TagService;

  public constructor(tagApplicationServiceRepository: ITagApplicationServiceRepository) {
    this.tagApplicationServiceRepository = tagApplicationServiceRepository;
    this.tagService = new TagService(this.tagApplicationServiceRepository);
  }

  public async create(name: string, bookId: string): Promise<void> {
    let tag = new TagModel(this.tagService.createUUID(), name);

    /* tagsにタグが存在するか確認し、存在しない場合はtagsに新規追加する処理 */
    const isExist = await this.tagService.isExist(tag); // Tagsに存在してないか確認
    if (!isExist) {
      await this.tagApplicationServiceRepository.createTag(tag); // Tagsに追加
    } else {
      const alreadyTag = await this.tagApplicationServiceRepository.findByName(tag.Name); // Tagsに存在しているか確認

      if (alreadyTag === null) throw new Error('The tag already exists and an error occurred when I tried to retrieve that tag.');

      tag = alreadyTag;
    }

    /* using_tagsに既に登録されているか */
    const isExistCombination = await this.tagApplicationServiceRepository.isExistCombination(tag.Id, bookId);
    if (!isExistCombination) {
      await this.tagApplicationServiceRepository.saveCombination(tag, bookId); // using_tagsに追加
    }
  }
}