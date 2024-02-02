import {DomainInvalidError} from '../../../presentation/error';

export default class AdminData {
  private id: string;
  private pw: string;

  public constructor(id: string, pw: string) {
    if (id === null) throw new DomainInvalidError('IDが空です。');
    if (pw === null) throw new DomainInvalidError('パスワードが空です。');

    this.id = id;
    this.pw = pw;
  }

  get Id(): string {
    return this.id;
  }
  get Pw(): string {
    return this.pw;
  }
}
