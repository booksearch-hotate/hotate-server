import {NextFunction, Request, Response, Router} from 'express';
import csurf from 'csurf';

import conversionpageStatus from '../../utils/conversionPageStatus';

// eslint-disable-next-line new-cap
const adminRouter = Router();

const csrfProtection = csurf({cookie: false});

/* 管理者用ホーム画面 */
adminRouter.get('/', csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = '管理画面';

  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/admin/', {pageData: res.pageData});
});

adminRouter.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect('/login');
  });
});

export default adminRouter;
