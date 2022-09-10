import {DomainInvalidError} from '../../../presentation/error';

export default class Admin {
  private id: string;
  private pw: string;

  private readonly MAX_ID_LEN = 30;
  private readonly MAX_PW_LEN = 60;

  public constructor(id: string | undefined, pw: string | undefined) {
    if (id === undefined || id.length === 0 || id.length > this.MAX_ID_LEN) throw new DomainInvalidError(`The format of the id is different. id: ${id}`);
    if (pw === undefined || pw.length === 0 || pw.length > this.MAX_PW_LEN) throw new DomainInvalidError(`The format of the password is different. password: ${pw}`);

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
