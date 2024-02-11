import {IThumbnailFileRepository} from "../../domain/repository/file/IThumbnailFileRepository";
import ThumbnailDeleteInputData from "../../presentation/dto/thumbnail/delete/ThumbnailDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteThumbnailUseCase implements Usecase<ThumbnailDeleteInputData, void> {
  constructor(private readonly thumbnailRepository: IThumbnailFileRepository) {}

  execute(input: ThumbnailDeleteInputData): void {
    this.thumbnailRepository.delete(input.fileName);
  }
}
