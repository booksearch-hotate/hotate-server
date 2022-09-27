import {NextFunction, Request, Response} from 'express';

export default function GlobalData(req: Request, res: Response, next: NextFunction) {
  res.pageData = {
    headTitle: '',
    path: req.path,
    csrfToken: '',
  };
  next();
};
