import {NextFunction, Request, Response} from 'express';

export default function SetPageData(req: Request, res: Response, next: NextFunction) {
  res.pageData = {
    headTitle: '', // head内のtitleタグに記述するメッセージ
    path: req.path, // パス名
    csrfToken: '', // csrfトークン
    serviceName: 'TREE', // サービス名
  };
  next();
};
