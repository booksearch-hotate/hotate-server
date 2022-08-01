import PaginationMargin from '../domain/model/pagination/paginationMarginModel';
import {IPaginationData} from '../routers/datas/IPaginationData';


const MIN_PAGINATION_COUNT = 3;
const MAX_PAGINATION_COUNT = 10;
const MIN_PAGIATION_MARGIN = 3;

export default function getPaginationInfo(
    pageCount: number,
    total: number,
    itemCount: number,
    maxPaginationCount: number,
): IPaginationData {
  /* ガード節 */
  if (maxPaginationCount < MIN_PAGINATION_COUNT || maxPaginationCount > MAX_PAGINATION_COUNT) throw new Error(`The number of paginations to display is inappropriate. The range is from ${MIN_PAGINATION_COUNT} to ${MAX_PAGINATION_COUNT} items.`);
  if (pageCount < 0) throw new Error('The pageCount is incorrect.');
  if (total < 0) throw new Error('The totalPage is incorrect.');

  const itemMargin = new PaginationMargin(itemCount);

  // ページネーションの幅を最低最小値に設定
  const paginationMargin = Math.max(maxPaginationCount / 2, MIN_PAGIATION_MARGIN);

  const totalPage = Math.ceil(total / itemMargin.Margin);
  const minPage = Math.max(pageCount - paginationMargin + 1, 1);
  const maxPage = Math.min(Math.max(maxPaginationCount - minPage + 1, pageCount + paginationMargin + 1), totalPage);

  return {
    pageRange: {
      min: minPage,
      max: maxPage,
    },
    totalPage: totalPage,
    pageCount,
  };
}
