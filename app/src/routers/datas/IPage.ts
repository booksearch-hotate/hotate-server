export interface IPage {
  headTitle: string; // ページのタイトル
  path: string;
  pathName?: string;
  origin?: string;
  csrfToken: string;
  anyData?: unknown; // その他のデータ
  status?: IPageStatus;
}

export interface IPageStatus {
  mes: string,
  buttonType: 'danger' | 'success' | 'warning' | 'info'
}
