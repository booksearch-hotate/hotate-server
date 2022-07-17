export default class RecommendationModel {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private createdAt: Date | null;
  private updatedAt: Date | null;
  private bookIds: string[];

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
  get Index() {
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
}
