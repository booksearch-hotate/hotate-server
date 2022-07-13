const MIN_ITEM_COUNT = 0;
const MAX_ITEM_COUNT = 20;
const MIN_PAGINATION_COUNT = 3;
const MAX_PAGINATION_COUNT = 10;
const MIN_PAGIATION_MARGIN = 3;

export default function getPaginationInfo(
    pageCount: number,
    total: number,
    itemCount: number,
    maxPaginationCount: number,
): {pageCount: number, totalPage: number, minPage: number, maxPage: number} {
  /* ガード節 */
  if (itemCount < MIN_ITEM_COUNT || itemCount > MAX_ITEM_COUNT) throw new Error(`The number of items displayed is inappropriate. The range is from ${MIN_ITEM_COUNT} to 20 items.`);
  if (maxPaginationCount < MIN_PAGINATION_COUNT || maxPaginationCount > MAX_PAGINATION_COUNT) throw new Error(`The number of paginations to display is inappropriate. The range is from ${MIN_PAGINATION_COUNT} to ${MAX_PAGINATION_COUNT} items.`);
  if (pageCount < 0) throw new Error('The pageCount is incorrect.');
  if (total < 0) throw new Error('The totalPage is incorrect.');

  // ページネーションの幅を最低最小値に設定
  const paginationMargin = Math.max(maxPaginationCount / 2, MIN_PAGIATION_MARGIN);

  const totalPage = Math.ceil(total / itemCount);
  const minPage = Math.max(pageCount - paginationMargin + 1, 1);
  const maxPage = Math.min(Math.max(maxPaginationCount - minPage + 1, pageCount + paginationMargin + 1), totalPage);

  return {
    pageCount,
    totalPage,
    minPage,
    maxPage,
  };
}
