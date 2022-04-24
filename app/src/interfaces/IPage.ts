export interface IPage {
  /** ページのタイトル */
  headTitle: string;
  path: string;
  pathName?: string;
  /** cssのファイル名 */
  cssData?: string[];
  /** オリジン */
  origin?: string;
  /** jsのファイル名 */
  jsData?: string[];
  /** その他のデータ */
  anyData?: unknown;
}
