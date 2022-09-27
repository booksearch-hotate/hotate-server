import {NextFunction, Request, Response} from 'express';

export default function GlobalData(req: Request, res: Response, next: NextFunction) {
  req.pageData = {
    headTitle: '',
    path: req.path,
    csrfToken: '',
  };
  next();
};
