export default class PaginationMarginModel {
  private margin: number;

  private readonly MAX_MARGIN_COUNT = 50; // データを1度に取得できる最大の個数

  public constructor(margin: number) {
    if (margin < 1 || margin > this.MAX_MARGIN_COUNT) throw new Error(`${margin} is outsite the 1 to ${this.MAX_MARGIN_COUNT} range.`);

    this.margin = margin;
  }

  get Margin() {
    return this.margin;
  }
}
