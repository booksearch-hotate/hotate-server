<<<<<<< HEAD
import {conversionDateToString} from '../../../utils/conversionDate';
=======
import conversionDate from '../../../utils/conversionDate';
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
import Recommendation from './recommendation';
import RecommendationItemData from './recommendationItemData';

export default class RecommendationData {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private thumbnailName: string;
  private createdAt: string;
  private updatedAt: string;
  private recommendationItems: RecommendationItemData[];

  public constructor(recommendationModel: Recommendation) {
    this.id = recommendationModel.Id;
    this.title = recommendationModel.Title;
    this.content = recommendationModel.Content;
    this.isSolid = recommendationModel.IsSolid;
    this.sortIndex = recommendationModel.SortIndex;
    this.thumbnailName = recommendationModel.ThumbnailName;
<<<<<<< HEAD
    this.createdAt = conversionDateToString(recommendationModel.CreatedAt);
    this.updatedAt = conversionDateToString(recommendationModel.UpdatedAt);
=======
    this.createdAt = conversionDate(recommendationModel.CreatedAt);
    this.updatedAt = conversionDate(recommendationModel.UpdatedAt);
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
    this.recommendationItems = recommendationModel.RecommendationItems.map((item) => new RecommendationItemData(item));
  }

  get Id() {
    return this.id;
  }

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
}
