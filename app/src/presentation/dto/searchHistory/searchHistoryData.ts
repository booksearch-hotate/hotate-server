import {conversionDateToString} from "../../../utils/conversionDate";
import SearchHistory from "../../../domain/model/searchHistory/searchHistory";

export default class SearchHistoryData {
  private words: string;
  private id: string;
  private createdAt: string;

  public constructor(tar: SearchHistory) {
    this.words = tar.Words;
    this.id = tar.Id.Id;
    this.createdAt = conversionDateToString(tar.CreatedAt);
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
