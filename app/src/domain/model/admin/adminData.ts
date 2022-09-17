import {DomainInvalidError} from '../../../presentation/error';

export default class AdminData {
  private id: string;
  private pw: string;

  public constructor(id: string, pw: string) {
    if (id === null) throw new DomainInvalidError('id of administrator is null.');
    if (pw === null) throw new DomainInvalidError('pw of administrator is null.');

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
