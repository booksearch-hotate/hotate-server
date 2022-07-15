import TagModel from '../domain/model/tag/tagModel';

import TagService from '../domain/service/tagService';

import {ITagRepository} from '../domain/model/tag/ITagRepository';

import TagData from '../domain/model/tag/tagData';

import Logger from '../infrastructure/logger/logger';

const logger = new Logger('TagApplicationService');

export default class TagApplicationService {
  private readonly tagRepository: ITagRepository;
  private readonly tagService: TagService;

  public constructor(tagApplicationServiceRepository: ITagRepository, tagService: TagService) {
    this.tagRepository = tagApplicationServiceRepository;
    this.tagService = tagService;
  }

  /**
   * タグと本を結びつける
   * @param name タグの名称
   * @param bookId 本のID
   * @returns 重複した組み合わせがあったか
   */
  public async create(name: string, bookId: string): Promise<boolean> {
    let tag = new TagModel(this.tagService.createUUID(), name, null);

    /* tagsにタグが存在するか確認し、存在しない場合はtagsに新規追加する処理 */
    const isExist = await this.tagService.isExist(tag); // Tagsに存在してないか確認
    logger.debug(`isExist: ${isExist}`);
    if (!isExist) {
      await this.tagRepository.createTag(tag); // Tagsに追加
    } else {
      const alreadyTag = await this.tagRepository.findByName(tag.Name); // Tagsに存在しているか確認

      if (alreadyTag === null) throw new Error('The tag already exists and an error occurred when I tried to retrieve that tag.');

      tag = alreadyTag;
    }

    logger.debug(`tag: ${tag}`);

    /* using_tagsに既に登録されているか */
    const isExistCombination = await this.tagRepository.isExistCombination(tag.Id, bookId);
    if (!isExistCombination) {
      await this.tagRepository.saveCombination(tag, bookId); // using_tagsに追加
      logger.debug('saveCombination');
    }
    return isExistCombination;
  }

  public async findAll(): Promise<TagData[]> {
    const tags = await this.tagRepository.findAll();
    const res: TagData[] = [];
    for (const tagObj of tags) {
      const [tag, count] = tagObj;
      res.push(new TagData(tag, count));
    }
    return res;
  }

  public async delete(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }

  public async isExistTable(): Promise<boolean> {
    return await this.tagRepository.isExistTable();
  }

  public async findById(id: string): Promise<TagData | null> {
    const tag = await this.tagRepository.findById(id);
    if (tag) return new TagData(tag, await this.tagService.getCount(tag));
    return null;
  }

  /**
   * `tags`と`using_tags`を削除する
   */
  public async deleteAll(): Promise<void> {
    await this.tagRepository.deleteAll();
  }

  public async update(id: string, name: string): Promise<void> {
    await this.tagRepository.update(id, name);
  }
}
