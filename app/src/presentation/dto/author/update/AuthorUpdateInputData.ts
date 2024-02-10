import AuthorId from "../../../../domain/model/author/authorId";

export default class AuthorUpdateInputData {
  public id: AuthorId;
  public name: string;

  public constructor(
      id: string,
      name: string,
  ) {
    this.id = new AuthorId(id);
    this.name = name;
  }
}
