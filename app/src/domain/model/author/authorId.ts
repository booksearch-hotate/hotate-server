import {v4 as uuidv4} from "uuid";

export default class AuthorId {
  private id: string;

  public constructor(id: string | null) {
    this.id = id === null ? uuidv4() : id;
  }

  public get Id(): string {
    return this.id;
  }
}
