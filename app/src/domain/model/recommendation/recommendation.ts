import {JSDOM} from "jsdom";
import DOMPurify from "dompurify";

import {DomainInvalidError} from "../../../presentation/error";
import RecommendationItem from "./recommendationItem";
import RecommendationId from "./recommendationId";

export default class Recommendation {
  private id: RecommendationId;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private thumbnailName: string;
  private createdAt: Date;
  private updatedAt: Date;
  private recommendationItems: RecommendationItem[];

  private readonly MAX_SHORTCUT_CONTENT_LEN = 100;
  private readonly MAX_CONTENT_LEN = 5000;
  private readonly MAX_HAVING_BOOK_COUNT = 10;
  private readonly MAX_TITLE_LEN = 100;

  constructor(
      id: RecommendationId,
      title: string,
      content: string,
      isSolid: boolean,
      sortIndex: number,
      thumbnailName: string,
      createdAt: Date,
      updatedAt: Date,
      recommendationItems: RecommendationItem[],
  ) {
    if (id === null) throw new DomainInvalidError("The id is null.");
    if (title.length === 0 || title.length > this.MAX_TITLE_LEN) throw new DomainInvalidError("タイトルのフォーマットが異なります。");
    if (content.length === 0|| content.length > this.MAX_CONTENT_LEN) throw new DomainInvalidError("内容のフォーマットが異なります。");
    if (isSolid === null) throw new DomainInvalidError("The isSolid is null.");
    if (thumbnailName === null) throw new DomainInvalidError("サムネイル名が空です。");
    if (sortIndex === null || sortIndex < 0) throw new DomainInvalidError("ソート順が不正な値です。");
    if (recommendationItems.length > this.MAX_HAVING_BOOK_COUNT) throw new DomainInvalidError("登録できる本の個数が最大を超えました。");

    this.id = id;
    this.title = title;
    this.content = content;
    this.isSolid = isSolid;
    this.sortIndex = sortIndex;
    this.thumbnailName = thumbnailName;
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
  get ThumbnailName() {
    return this.thumbnailName;
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
    if (title.length === 0) throw new DomainInvalidError("Empty title.");

    this.title = title;
  }

  public changeContent(content: string) {
    if (content.length === 0) throw new DomainInvalidError("Empty content.");

    this.content = content;
  }

  public changeSortIndex(sortIndex: number) {
    if (sortIndex < 1) throw new DomainInvalidError("Invalid sort index.");

    this.sortIndex = sortIndex;
  }

  public changeThumbnailName(thumbnailName: string) {
    if (thumbnailName.length === 0) throw new DomainInvalidError("Invalid name of thumbnail");

    this.thumbnailName = thumbnailName;
  }

  public changeIsSolid(isSolid: boolean) {
    this.isSolid = isSolid;
  }

  public changeItems(bookIds: RecommendationItem[]) {
    if (bookIds.length > this.MAX_HAVING_BOOK_COUNT) throw new DomainInvalidError("The maximum number of units held has been exceeded.");
    this.recommendationItems = bookIds;
  }

  public replaceItems(bookIds: RecommendationItem[]) {
    if (bookIds.length > this.MAX_HAVING_BOOK_COUNT) throw new DomainInvalidError("The maximum number of units held has been exceeded.");
    this.recommendationItems = bookIds;
  }

  public omitContent() {
    if (this.content.length > this.MAX_SHORTCUT_CONTENT_LEN) this.content = `${this.content.substring(0, this.MAX_SHORTCUT_CONTENT_LEN)}.....`;
  }

  public isOverNumberOfBooks() {
    return this.recommendationItems.length > this.MAX_HAVING_BOOK_COUNT;
  }

  public sanitizeContent() {
    const window = new JSDOM("").window as unknown as Window;
    // eslint-disable-next-line new-cap
    const purify = DOMPurify(window);

    this.content = purify.sanitize(this.content);
  }
}
