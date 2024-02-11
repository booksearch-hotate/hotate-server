import AuthorId from "../../../../domain/model/author/authorId";

export default class AuthorSaveOutputData {
  public authorId: string;

  public constructor(authorId: AuthorId) {
    this.authorId = authorId.Id;
  }
}
