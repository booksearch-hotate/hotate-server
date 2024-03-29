import {marked} from "marked";

import {conversionDateToString} from "../../../utils/conversionDate";
import RecommendationItemData from "./recommendationItemData";
import Recommendation from "../../../domain/model/recommendation/recommendation";

export default class RecommendationData {
  private id: string;
  private title: string;
  private content: string;
  private isSolid: boolean;
  private sortIndex: number;
  private thumbnailName: string;
  private createdAt: string;
  private updatedAt: string;
  private htmlContent: string | Promise<string>; // Contentの内容をhtmlにパースしたhtml(文字列)
  private recommendationItems: RecommendationItemData[];

  public constructor(recommendationModel: Recommendation) {
    this.id = recommendationModel.Id.Id;
    this.title = recommendationModel.Title;
    this.content = recommendationModel.Content;
    this.isSolid = recommendationModel.IsSolid;
    this.sortIndex = recommendationModel.SortIndex;
    this.thumbnailName = recommendationModel.ThumbnailName;
    this.createdAt = conversionDateToString(recommendationModel.CreatedAt, ["hour", "second", "minute"]);
    this.updatedAt = conversionDateToString(recommendationModel.UpdatedAt);
    this.recommendationItems = recommendationModel.RecommendationItems.map((item) => new RecommendationItemData(item));

    const parsedContent = marked.parse(recommendationModel.Content);
    this.htmlContent = parsedContent;
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

  public async HtmlContent(): Promise<string> {
    return this.htmlContent;
  }

  get RecommendationItems() {
    return this.recommendationItems;
  }
}
