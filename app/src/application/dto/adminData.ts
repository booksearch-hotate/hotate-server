export default class AdminData {
  private id: string;
  private pw: string;

  public constructor(id: string, pw: string) {
    if (id === null) throw new Error('idがnullです');
    if (pw === null) throw new Error('pwがnullです');

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
