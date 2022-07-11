export default class PaginationInfo {
  private itemCount: number;
  private maxPaginationCount: number;
  private pageCount: number;
  private total: number;
  private paginationMargin: number;

  private MIN_ITEM_COUNT = 5;
  private MAX_ITEM_COUNT = 20;
  private MIN_PAGINATION_COUNT = 3;
  private MAX_PAGINATION_COUNT = 10;
  private MIN_PAGIATION_MARGIN = 3;

  constructor(
      pageCount: number,
      total: number,
      itemCount: number,
      maxPaginationCount: number,
  ) {
    if (itemCount < this.MIN_ITEM_COUNT || itemCount > this.MAX_ITEM_COUNT) throw new Error(`The number of items displayed is inappropriate. The range is from ${this.MIN_ITEM_COUNT} to 20 items.`);
    if (maxPaginationCount < this.MIN_PAGINATION_COUNT || maxPaginationCount > this.MAX_PAGINATION_COUNT) throw new Error(`The number of paginations to display is inappropriate. The range is from ${this.MIN_PAGINATION_COUNT} to ${this.MAX_PAGINATION_COUNT} items.`);
    if (pageCount < 0) throw new Error('The pageCount is incorrect.');
    if (total < 0) throw new Error('The totalPage is incorrect.');

    this.itemCount = itemCount;
    this.maxPaginationCount = maxPaginationCount;
    this.pageCount = pageCount;
    this.total = total;
    // ページネーションの幅を最低最小値に設定
    this.paginationMargin = Math.max(this.maxPaginationCount / 2, this.MIN_PAGIATION_MARGIN);
  }

  public getPaginationInfo(): {pageCount: number, totalPage: number, minPage: number, maxPage: number} {
    const pageCount = this.pageCount;
    const totalPage = Math.ceil(this.total / this.itemCount);
    const minPage = Math.max(this.pageCount - this.paginationMargin + 1, 1);
    const maxPage = Math.min(Math.max(this.maxPaginationCount - minPage + 1, pageCount + this.paginationMargin + 1), totalPage);

    return {
      pageCount,
      totalPage,
      minPage,
      maxPage,
    };
  }
}
