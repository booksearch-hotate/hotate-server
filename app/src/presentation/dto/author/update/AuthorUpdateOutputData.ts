import AuthorId from "../../../../domain/model/author/authorId";

export default class AuthorUpdateOutputData {
  public authorId: string;

  public constructor(authorId: AuthorId) {
    this.authorId = authorId.Id;
  }
}
