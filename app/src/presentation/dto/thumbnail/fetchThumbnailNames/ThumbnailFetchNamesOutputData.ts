export default class ThumbnailFetchNamesOutputData {
  public allTypeNames: string[];
  public defaultNames: string[];

  public constructor(allTypeNames: string[], defaultNames: string[]) {
    this.allTypeNames = allTypeNames;
    this.defaultNames = defaultNames;
  }
}
