import {Request} from "express";

/**
 * ページネーションで用いるページ数に変換する関数
 * @param req リクエスト
 * @param pageKey ページ数が格納されているキー
 * @returns 変換したページ数
 */
export default function conversionpageCounter(req: Request, pageKey: string = "page") {
  let pageCount = Number(req.query[pageKey] as string);

  if (isNaN(pageCount)) pageCount = 0;
  else pageCount--;

  if (pageCount < 0) pageCount = 0;

  return pageCount;
}
