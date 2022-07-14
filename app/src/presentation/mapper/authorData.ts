import AuthorModel from '../../domain/model/author/authorModel';

export default class AuthorData {
  private id: string;
  private name!: string | null;

  public constructor(authorModel: AuthorModel) {
    this.id = authorModel.Id;
    this.name = authorModel.Name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }
}
