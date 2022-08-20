import Tag from '../domain/model/tag/tag';

import TagService from '../domain/service/tagService';

import {ITagRepository} from '../domain/model/tag/ITagRepository';
import {IBookRepository} from '../domain/model/book/IBookRepository';

import TagData from '../domain/model/tag/tagData';

import Logger from '../infrastructure/logger/logger';
import BookId from '../domain/model/book/bookId';

const logger = new Logger('TagApplicationService');

export default class TagApplicationService {
  private readonly tagRepository: ITagRepository;
  private readonly bookRepository: IBookRepository;
  private readonly tagService: TagService;

  public constructor(tagRepository: ITagRepository, bookRepository: IBookRepository, tagService: TagService) {
    this.tagRepository = tagRepository;
    this.bookRepository = bookRepository;
    this.tagService = tagService;
  }

  /**
   * タグと本を結びつける
   * @param name タグの名称
   * @param bookId 本のID
   * @returns 重複した組み合わせがあったか
   */
  public async create(name: string, bookId: string): Promise<boolean> {
    let tag = new Tag(this.tagService.createUUID(), name, null, [bookId]);

    const book = await this.bookRepository.searchById(new BookId(bookId));

    if (book.isOverNumberOfTags()) throw new Error('The maximum number of tags that can be added to a tag has been exceeded.');

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
    return tags.map((tag) => new TagData(tag));
  }

  public async delete(id: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);

    if (tag === null) return;

    await this.tagRepository.delete(tag);
  }

  public async isExistTable(): Promise<boolean> {
    return await this.tagRepository.isExistTable();
  }

  public async findById(id: string): Promise<TagData | null> {
    const tag = await this.tagRepository.findById(id);
    if (tag) return new TagData(tag);
    return null;
  }

  /**
   * `tags`と`using_tags`を削除する
   */
  public async deleteAll(): Promise<void> {
    await this.tagRepository.deleteAll();
  }

  public async update(id: string, name: string): Promise<void> {
    const tag = await this.tagRepository.findById(id);

    if (tag === null) throw new Error('The tag not found.');

    tag.changeName(name);

    await this.tagRepository.update(tag);
  }

  /**
   * 本IDからタグの情報を取得します
   */
  public async findByBookId(bookId: string): Promise<TagData[]> {
    const bookIdModel = new BookId(bookId);

    const tagModels = await this.tagRepository.findByBookId(bookIdModel);

    return tagModels.map((item) => new TagData(item));
  }

  public async deleteByBookId(bookId: string): Promise<void> {
    const bookIdModel = new BookId(bookId);

    const tagModels = await this.tagRepository.findByBookId(bookIdModel);

    await Promise.all(tagModels.map(async (element) => await this.tagRepository.delete(element)));
  }
}
