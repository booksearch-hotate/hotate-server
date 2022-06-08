import {Request, Response, Router, NextFunction} from 'express';

import AdminSession from '../../infrastructure/session';
import Logger from '../../infrastructure/logger/logger';

import {IPage} from '../obj/IPage';

// eslint-disable-next-line new-cap
const adminRouter = Router();

const admin = new AdminSession();

const pageData: IPage = {} as IPage;

const logger = new Logger('adminHome');

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
const authCheckMiddle = (req: Request, res: Response, next: NextFunction) => {
  if (admin.verify(req.session.token)) {
    next();
  } else {
    res.redirect('/login');
  }
};

// uriの始まりがauthのときに認証を行う
adminRouter.use('/', authCheckMiddle);

/* 管理者用ホーム画面 */
adminRouter.get('/', (req: Request, res: Response) => {
  pageData.headTitle = '管理画面';

  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/', {pageData});
});

adminRouter.post('/logout', (req: Request, res: Response) => {
  try {
    admin.delete(req);
    res.redirect('/login');

    logger.info('Logout succeeded.');
  } catch (e) {
    logger.error(e as string);
    res.redirect('/admin');
  }
});

export default adminRouter;
