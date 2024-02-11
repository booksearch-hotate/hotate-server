import {IThumbnailFileRepository} from "../../domain/repository/file/IThumbnailFileRepository";
import ThumbnailFetchNamesOutputData from "../../presentation/dto/thumbnail/fetchThumbnailNames/ThumbnailFetchNamesOutputData";
import {Usecase} from "../Usecase";

export default class FetchThumbnailNamesUseCase implements Usecase<void, ThumbnailFetchNamesOutputData> {
  private recommendationFile: IThumbnailFileRepository;

  public constructor(recommendationFile: IThumbnailFileRepository) {
    this.recommendationFile = recommendationFile;
  }

  public execute(input: void): ThumbnailFetchNamesOutputData {
    const fileList = this.recommendationFile.fetchName();
    const defaultFileList = this.recommendationFile.fetchDefaultFileName();

    return new ThumbnailFetchNamesOutputData(fileList, defaultFileList);
  }
}
