export interface IThumbnailFileRepository {
  fetchName(): string[];
  fetchDefaultFileName(): string[];
  fetchCustomFileName(): string[];
  save(multerFileName: string): Promise<string>;
  delete(fileName: string): void;
}
