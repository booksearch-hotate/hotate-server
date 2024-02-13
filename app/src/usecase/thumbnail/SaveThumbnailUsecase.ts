import {IThumbnailFileRepository} from "../../domain/repository/file/IThumbnailFileRepository";
import ThumbnailSaveInputData from "../../presentation/dto/thumbnail/save/ThumbnailSaveInputData";
import ThumbnailSaveOutputData from "../../presentation/dto/thumbnail/save/ThumbnailSaveOutputData";
import {Usecase} from "../Usecase";

export default class SaveThumbnailUseCase implements Usecase<ThumbnailSaveInputData, Promise<ThumbnailSaveOutputData>> {
  constructor(private readonly recommendationFile: IThumbnailFileRepository) {}

  public async execute(input: ThumbnailSaveInputData): Promise<ThumbnailSaveOutputData> {
    const multerFileName = input.multerFileName;

    const newFileName = await this.recommendationFile.save(multerFileName);

    return new ThumbnailSaveOutputData(newFileName);
  }
}
