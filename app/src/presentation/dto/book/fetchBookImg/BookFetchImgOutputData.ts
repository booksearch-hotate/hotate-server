export default class BookFetchImgOutputData {
  public url: string;

  public constructor(url: string | null) {
    this.url = url || "/img/not-found.png";
  }
}
