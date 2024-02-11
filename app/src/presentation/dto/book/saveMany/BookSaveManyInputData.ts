export default class BookSaveManyInputData {
  public dataList: {
    bookName: string;
    subName: string | null;
    content: string | null;
    isbn: string | null;
    ndc: number | null;
    year: number | null;
    authorId: string;
    authorName: string;
    publisherId: string;
    publisherName: string;
  }[];

  public constructor(rowData: {
    bookName: string;
    subName: string | null;
    content: string | null;
    isbn: string | null;
    ndc: number | null;
    year: number | null;
    authorId: string;
    authorName: string;
    publisherId: string;
    publisherName: string;
  }[]) {
    this.dataList = rowData;
  }
}
