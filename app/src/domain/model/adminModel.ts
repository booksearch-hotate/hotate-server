export default class AdminModel {
  private id: string;
  private pw: string;

  public constructor(id: string | undefined, pw: string | undefined) {
    if (id === undefined) throw new Error('idが不明です');
    if (pw === undefined) throw new Error('pwが不明です');

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
