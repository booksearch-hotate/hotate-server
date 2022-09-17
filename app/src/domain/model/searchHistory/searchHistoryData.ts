import conversionDate from '../../../utils/conversionDate';
import SearchHistory from './searchHistory';

export default class SearchHistoryData {
  private words: string;
  private id: string;
  private createdAt: string;

  public constructor(tar: SearchHistory) {
    this.words = tar.Words;
    this.id = tar.Id;
    this.createdAt = conversionDate(tar.CreatedAt);
  }

  get Words(): string {
    return this.words;
  }

  get Id(): string {
    return this.id;
  }

  get CreatedAt(): string {
    return this.createdAt;
  }
}
