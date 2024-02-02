import {DomainInvalidError} from '../../../presentation/error';

export default class Author {
  private id: string;
  private name: string | null;

  private readonly MAX_NAME_LEN = 200;

  public constructor(id: string, name: string | null) {
    if (id === null) throw new DomainInvalidError('idが空です。');
    if (name !== null && name.length > this.MAX_NAME_LEN) throw new DomainInvalidError(`著者名の長さが上限の${this.MAX_NAME_LEN}文字に達しています。 現在の著者名の長さ: ${name.length}`);

    this.id = id;
    this.name = name;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string | null {
    return this.name;
  }

  changeName(name: string) {
    this.name = name;
  }
}
