import TreeResponse from "../../../response/TreeResponse";
import RecommendationData from "../RecommendationData";
import RecommendationFetchMaxIndexOutputData from "../fetchMaxIndex/RecommendationFetchMaxIndexOutputData";
import ThumbnailFetchNamesOutputData from "../../thumbnail/fetchThumbnailNames/ThumbnailFetchNamesOutputData";
import RecommendationOutputData from "../find/RecommendationFindOutputData";

export type RecommendationDetailControllerOutputData = {
  recommendation: RecommendationOutputData;
  maxIndex: RecommendationFetchMaxIndexOutputData;
  thumbnailOutput: ThumbnailFetchNamesOutputData;
}

export default class RecommendationDetailResponse extends TreeResponse<RecommendationDetailControllerOutputData> {
  public recommendation: RecommendationData | null = null;
  public maxIndex: number | null = null;
  public thumbnailNames: string[] = [];
  public defaultThumbnailNames: string[] = [];

  public success(output: RecommendationDetailControllerOutputData) {
    this.recommendation = output.recommendation.recommendation;
    this.maxIndex = output.maxIndex.maxIndex;
    this.thumbnailNames = output.thumbnailOutput.allTypeNames;
    this.defaultThumbnailNames = output.thumbnailOutput.defaultNames;

    return this;
  }

  public error() {
    return this;
  }
}
