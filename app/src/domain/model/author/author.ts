import {DomainInvalidError} from "../../../presentation/error";
import AuthorId from "./authorId";

export default class Author {
  private id: AuthorId;
  private name: string | null;

  private readonly MAX_NAME_LEN = 200;

  public constructor(id: AuthorId, name: string | null) {
    if (name !== null && name.length > this.MAX_NAME_LEN) throw new DomainInvalidError(`Over length of autor name. Length of author name: ${name.length}`);

    this.id = id;
    this.name = name;
  }

  get Id(): AuthorId {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }

  changeName(name: string) {
    this.name = name;
  }
}
