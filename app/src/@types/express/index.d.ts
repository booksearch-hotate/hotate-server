interface IPageStatus {
  mes: string,
  buttonType: 'danger' | 'success' | 'warning' | 'info'
}

interface IPage {
  headTitle: string; // ページのタイトル
  path: string;
  pathName?: string;
  origin?: string;
  csrfToken: string;
  anyData?: unknown; // その他のデータ
  status?: IPageStatus;
}

declare global {
  module 'express' {
    // eslint-disable-next-line no-unused-vars
    interface Request {
       pageData?: IPage
    }
  }
}
