export default class SearchHistory {
  private words: string;
  private id: string;
  private createdAt: Date;

  public constructor(id:string, words: string, createdAt: Date) {
    if (words === undefined) throw new Error('wordsが不明です');
    if (id === undefined) throw new Error('idが不明です');
    if (createdAt === undefined) throw new Error('作成日時が不明です');

    this.words = words;
    this.id = id;
    this.createdAt = new Date(createdAt);
  }

  get Words(): string {
    return this.words;
  }

  get Id(): string {
    return this.id;
  }

  get CreatedAt(): Date {
    return this.createdAt;
  }
}
