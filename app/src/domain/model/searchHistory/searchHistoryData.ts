<<<<<<< HEAD
import {conversionDateToString} from '../../../utils/conversionDate';
=======
import conversionDate from '../../../utils/conversionDate';
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
import SearchHistory from './searchHistory';

export default class SearchHistoryData {
  private words: string;
  private id: string;
  private createdAt: string;

  public constructor(tar: SearchHistory) {
    this.words = tar.Words;
    this.id = tar.Id;
<<<<<<< HEAD
    this.createdAt = conversionDateToString(tar.CreatedAt);
=======
    this.createdAt = conversionDate(tar.CreatedAt);
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
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
