export default class RecommendationModel {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private createdAt: Date | null;
  private updatedAt: Date | null;
  private bookIds: string[];

  private MAX_CONTENT_LEN = 20;

  constructor(
      id: string,
      title: string,
      content: string,
      isSolid: boolean,
      sortIndex: number,
      createdAt: Date | null,
      updatedAt: Date | null,
      bookIds: string[],
  ) {
    if (id === null) throw new Error('The id is null.');
    if (title.length === 0) throw new Error('Empty title.');
    if (content.length === 0) throw new Error('Empty content.');
    if (isSolid === null) throw new Error('The isSolid is null.');
    if (sortIndex === null || sortIndex < 0) throw new Error('Incorrect id.');

    this.id = id;
    this.title = title;
    this.content = content;
    this.isSolid = isSolid;
    this.sortIndex = sortIndex;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.bookIds = bookIds;
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
  get BookIds() {
    return this.bookIds;
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

  public replaceBookIds(bookIds: string[]) {
    this.bookIds = bookIds;
  }

  public omitContent() {
    if (this.content.length > this.MAX_CONTENT_LEN) this.content = `${this.content.substring(0, this.MAX_CONTENT_LEN)}.....`;
  }
}
