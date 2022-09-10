import {DomainInvalidError} from '../../../presentation/error';
import RecommendationItem from './recommendationItem';

export default class Recommendation {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private createdAt: Date | null;
  private updatedAt: Date | null;
  private recommendationItems: RecommendationItem[];

  private readonly MAX_SHORTCUT_CONTENT_LEN = 100;
  private readonly MAX_CONTENT_LEN = 500;
  private readonly MAX_HAVING_BOOK_COUNT = 10;
  private readonly MAX_TITLE_LEN = 100;

  constructor(
      id: string,
      title: string,
      content: string,
      isSolid: boolean,
      sortIndex: number,
      createdAt: Date | null,
      updatedAt: Date | null,
      recommendationItems: RecommendationItem[],
  ) {
    if (id === null) throw new Error('The id is null.');
    if (title.length === 0 || title.length > this.MAX_TITLE_LEN) throw new DomainInvalidError(`The format of the title of recommendation section is different. Title of recommendation section: ${title}`);
    if (content.length === 0|| content.length > this.MAX_CONTENT_LEN) throw new DomainInvalidError('The format of the content of recommendation section is different.');
    if (isSolid === null) throw new Error('The isSolid is null.');
    if (sortIndex === null || sortIndex < 0) throw new Error('Incorrect id.');
    if (recommendationItems.length > this.MAX_HAVING_BOOK_COUNT) throw new Error('The maximum number of units held has been exceeded.');

    this.id = id;
    this.title = title;
    this.content = content;
    this.isSolid = isSolid;
    this.sortIndex = sortIndex;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.recommendationItems = recommendationItems;
  }

  get Id() {
    return this.id;
  };
  get Title() {
    return this.title;
  }
  get Content() {
    return this.content;
  }
  get IsSolid() {
    return this.isSolid;
  }
  get SortIndex() {
    return this.sortIndex;
  }
  get CreatedAt() {
    return this.createdAt;
  }
  get UpdatedAt() {
    return this.updatedAt;
  }
  get RecommendationItems() {
    return this.recommendationItems;
  }

  public changeTitle(title: string) {
    if (title.length === 0) throw new Error('Empty title.');

    this.title = title;
  }

  public changeContent(content: string) {
    if (content.length === 0) throw new Error('Empty content.');

    this.content = content;
  }

  public changeSortIndex(sortIndex: number) {
    if (sortIndex < 1) throw new Error('Invalid sort index.');

    this.sortIndex = sortIndex;
  }

  public changeIsSolid(isSolid: boolean) {
    this.isSolid = isSolid;
  }

  public replaceItems(bookIds: RecommendationItem[]) {
    if (bookIds.length > this.MAX_HAVING_BOOK_COUNT) throw new Error('The maximum number of units held has been exceeded.');
    this.recommendationItems = bookIds;
  }

  public omitContent() {
    if (this.content.length > this.MAX_SHORTCUT_CONTENT_LEN) this.content = `${this.content.substring(0, this.MAX_SHORTCUT_CONTENT_LEN)}.....`;
  }

  public isOverNumberOfBooks() {
    return this.recommendationItems.length > this.MAX_HAVING_BOOK_COUNT;
  }
}
