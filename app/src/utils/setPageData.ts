import {NextFunction, Request, Response} from 'express';

export default function SetPageData(req: Request, res: Response, next: NextFunction) {
  res.pageData = {
    headTitle: '',
    path: req.path,
    csrfToken: '',
    serviceName: 'TREE',
  };
  next();
};
