import ThumbnailSaveOutputData from "../../dto/thumbnail/save/ThumbnailSaveOutputData";
import TreeResponse from "../TreeResponse";

export default class ThumbnailSaveResponse extends TreeResponse<ThumbnailSaveOutputData> {
  public fileName: string | null = null;

  public success(o: ThumbnailSaveOutputData) {
    this.fileName = o.fileName;
    return this;
  }
}
