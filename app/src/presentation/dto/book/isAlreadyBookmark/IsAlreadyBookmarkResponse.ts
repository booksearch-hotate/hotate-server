import TreeResponse from "../../../response/TreeResponse";

export default class IsAlreadyBookmarkResponse extends TreeResponse<boolean> {
  public isAlready: boolean | null = null;
  public success(o: boolean) {
    this.isAlready = o;
    return this;
  }

  public error() {
    return this;
  }
}
