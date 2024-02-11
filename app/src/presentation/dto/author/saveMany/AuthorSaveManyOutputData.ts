import Author from "../../../../domain/model/author/author";
import AuthorData from "../authorData";

export default class AuthorSaveManyOutputData {
  public dataList: AuthorData[] = [];

  public constructor(authors: Author[]) {
    this.dataList = authors.map((author) => new AuthorData(author));
  }
}
