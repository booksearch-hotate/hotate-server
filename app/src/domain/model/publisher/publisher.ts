import {DomainInvalidError} from "../../../presentation/error";
import PublisherId from "./publisherId";

export default class Publisher {
  private id: PublisherId;
  private name!: string | null;

  private readonly MAX_NAME_LEN = 200;

  public constructor(id: PublisherId, name: string | null) {
    if (name !== null && name.length > this.MAX_NAME_LEN) throw new DomainInvalidError(`出版社名の文字数は1文字以上${this.MAX_NAME_LEN}文字未満にしてください。`);

    this.id = id;
    this.name = name;
  }

  get Id(): PublisherId {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }

  public changeName(name: string) {
    this.name = name;
  }
}
