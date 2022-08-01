export default class Admin {
  private id: string;
  private pw: string;

  public constructor(id: string | undefined, pw: string | undefined) {
    if (id === undefined || id.length === 0) throw new Error('The id is unknown.');
    if (pw === undefined || pw.length === 0) throw new Error('The password is unknown.');

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
