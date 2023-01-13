import {Request, Response, Router, NextFunction} from 'express';
import csurf from 'csurf';

import AdminService from '../../domain/service/adminService';

import AdminRepository from '../../interface/repository/adminRepository';

import AdminApplicationService from '../../application/adminApplicationService';

import db from '../../infrastructure/db';
import AdminSession from '../../presentation/session';
import Logger from '../../infrastructure/logger/logger';

import AdminData from '../../domain/model/admin/adminData';


import conversionpageStatus from '../../utils/conversionPageStatus';

// eslint-disable-next-line new-cap
const adminRouter = Router();

const admin = new AdminSession();

<<<<<<< HEAD
=======


>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
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
  res.pageData.headTitle = '管理画面';

  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/admin/', {pageData: res.pageData});
});

adminRouter.post('/logout', (req: Request, res: Response) => {
  try {
    admin.delete(req);
    req.session.status = {type: 'Success', mes: 'ログアウトが完了しました'};
    res.redirect('/login');

    logger.info('Logout succeeded.');
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: 'ログアウトに失敗しました'};
    res.redirect('/admin');
  }
});

export default adminRouter;
