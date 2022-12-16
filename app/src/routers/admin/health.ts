import {Request, Response, Router} from 'express';
import csurf from 'csurf';

// eslint-disable-next-line new-cap
const healthRouter = Router();

const csrfProtection = csurf({cookie: false});

healthRouter.get('/', csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = '本の登録状態の確認';
  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/health/index', {pageData: res.pageData});
});

export default healthRouter;
