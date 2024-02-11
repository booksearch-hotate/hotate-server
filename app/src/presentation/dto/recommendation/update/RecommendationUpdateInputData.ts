export default class RecommendationUpdateInputData {
  public id: string;
  public title: string;
  public content: string;
  public thumbnailName: string;
  public isSolid: boolean;
  public formSortIndex: number;
  public recommendationItems: {
    bookId: string;
    comment: string;
  }[];

  public constructor(rowData: {
    id: string;
    title: string;
    content: string;
    thumbnailName: string;
    isSolid: boolean;
    formSortIndex: number;
    recommendationItems: {bookId: string, comment: string}[];
  }) {
    this.id = rowData.id;
    this.title = rowData.title;
    this.content = rowData.content;
    this.thumbnailName = rowData.thumbnailName;
    this.isSolid = rowData.isSolid;
    this.formSortIndex = rowData.formSortIndex;
    this.recommendationItems = rowData.recommendationItems;
  }
}
