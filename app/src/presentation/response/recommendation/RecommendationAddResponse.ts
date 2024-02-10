import ThumbnailFetchNamesOutputData from "../../dto/thumbnail/fetchThumbnailNames/ThumbnailFetchNamesOutputData";
import TreeResponse from "../TreeResponse";

export default class RecommendationAddResponse extends TreeResponse<ThumbnailFetchNamesOutputData> {
  public defaultTypeList: string[] = [];
  public thumbnailNameList: string[] = [];

  public success(o: ThumbnailFetchNamesOutputData) {
    this.thumbnailNameList = o.allTypeNames;
    this.defaultTypeList = o.defaultNames;
    return this;
  }

  public error() {
    return this;
  }
}
