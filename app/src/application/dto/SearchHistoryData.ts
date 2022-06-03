import SearchHistoryModel from '../../domain/model/searchHistoryModel';

export default class SearchHistoryData {
  private words: string;
  private id: string;

  public constructor(tar: SearchHistoryModel) {
    this.words = tar.Words;
    this.id = tar.Id;
  }

  get Words(): string {
    return this.words;
  }

  get Id(): string {
    return this.id;
  }
}
