import SearchHistory from './searchHistoryModel';

export default class SearchHistoryData {
  private words: string;
  private id: string;
  private createdAt: Date;

  public constructor(tar: SearchHistory) {
    this.words = tar.Words;
    this.id = tar.Id;
    this.createdAt = tar.CreatedAt;
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
