import {IThumbnailFileRepository} from "../../../../domain/repository/file/IThumbnailFileRepository";
import ThumbnailFileAccessor from "../thumbnailFile";

export default class ThumbnailFileRepository implements IThumbnailFileRepository {
  private accessor: ThumbnailFileAccessor;

  public constructor(accessor: ThumbnailFileAccessor) {
    this.accessor = accessor;
  }

  fetchName(): string[] {
    return this.accessor.fetchNames();
  }

  fetchCustomFileName(): string[] {
    return this.accessor.fetchNames("custom");
  }

  fetchDefaultFileName(): string[] {
    return this.accessor.fetchNames("default");
  }

  save(multerFileName: string): Promise<string> {
    return this.accessor.save(multerFileName);
  }

  delete(fileName: string): void {
    this.accessor.delete(fileName);
  }
}
