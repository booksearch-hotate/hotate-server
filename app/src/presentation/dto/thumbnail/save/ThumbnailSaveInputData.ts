export default class ThumbnailSaveInputData {
  public multerFileName: string;

  public constructor(multerFileName: string) {
    this.multerFileName = multerFileName;
  }
}
