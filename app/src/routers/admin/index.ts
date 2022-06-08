import {Request, Response, Router, NextFunction} from 'express';
import csurf from 'csurf';

import AdminService from '../../domain/service/adminService';

import AdminRepository from '../../interface/repository/AdminRepository';

import AdminApplicationService from '../../application/AdminApplicationService';

import db from '../../infrastructure/db';
import AdminSession from '../../infrastructure/session';
import Logger from '../../infrastructure/logger/logger';

import AdminData from '../../application/dto/AdminData';

import {IPage} from '../datas/IPage';

// eslint-disable-next-line new-cap
const adminRouter = Router();

const admin = new AdminSession();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('adminHome');

const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
const authCheckMiddle = async (req: Request, res: Response, next: NextFunction) => {
  if (admin.verifyToken(req.session.token)) {
    const adminData = new AdminData(admin.Id, admin.Pw);
    if (await adminApplicationService.isValid(adminData)) {
      return next();
    }
  }
  return res.redirect('/login');
};

// uriの始まりがauthのときに認証を行う
adminRouter.use('/', authCheckMiddle);

/* 管理者用ホーム画面 */
adminRouter.get('/', csrfProtection, (req: Request, res: Response) => {
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
