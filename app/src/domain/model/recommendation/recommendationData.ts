import Recommendation from './recommendationModel';
import RecommendationItemData from './recommendationItemData';

export default class RecommendationData {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private createdAt: Date | null;
  private updatedAt: Date | null;
  private recommendationItems: RecommendationItemData[];

  public constructor(recommendationModel: Recommendation) {
    this.id = recommendationModel.Id;
    this.title = recommendationModel.Title;
    this.content = recommendationModel.Content;
    this.isSolid = recommendationModel.IsSolid;
    this.sortIndex = recommendationModel.SortIndex;
    this.createdAt = recommendationModel.CreatedAt;
    this.updatedAt = recommendationModel.UpdatedAt;
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
