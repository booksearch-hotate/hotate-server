export default class RecommendationInsertInputData {
  public title: string;
  public content: string;
  public thumbnailName: string;

  public constructor(title: string, content: string, thumbnailName: string) {
    this.title = title;
    this.content = content;
    this.thumbnailName = thumbnailName;
  }
}
