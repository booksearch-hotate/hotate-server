/**
 * ページネーションに関する情報を取得
 * @param query クエリとして指定されたページ数
 * @param total 全体のデータ件数
 * @returns ページング情報
 */
export default function getPaginationInfo(query: any, total: number) {
  let pageCount = Number(query as string);
  let totalPage = 0;
  let minPage = 0;
  let maxPage = 0;

  if (isNaN(pageCount)) pageCount = 0;
  else pageCount--;

  if (pageCount <= 0) pageCount = 0;

  totalPage = Math.ceil(total / 10); // 最大ページ数
  minPage = Math.max(pageCount - 3, 1); // 最小ページ数
  maxPage = Math.min(Math.max(7 - minPage + 1, pageCount + 3), totalPage); // 最大ページ数

  return {
    pageCount,
    totalPage,
    minPage,
    maxPage,
  };
};
