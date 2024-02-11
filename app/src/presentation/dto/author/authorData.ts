import Author from "../../../domain/model/author/author";

export default class AuthorData {
  private id: string;
  private name!: string | null;

  public constructor(authorModel: Author) {
    this.id = authorModel.Id.Id;
    this.name = authorModel.Name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }
}
