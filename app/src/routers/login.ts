import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import AdminService from '../domain/service/adminService';

import AdminApplicationService from '../application/AdminApplicationService';

import AdminRepository from '../interface/repository/AdminRepository';

import db from '../infrastructure/db';
import Logger from '../infrastructure/logger/logger';
import AdminSession from '../infrastructure/session';

import AdminData from '../application/dto/AdminData';

import {IPage} from './datas/IPage';

import conversionpageStatus from '../modules/conversionPageStatus';

// eslint-disable-next-line new-cap
const loginRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const admin = new AdminSession();

const logger = new Logger('loginFlow');

const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);

/* ログイン画面 */
loginRouter.get('/login', csrfProtection, async (req: Request, res: Response) => {
  if (admin.verifyToken(req.session.token)) return res.redirect('/admin/');

  // もしも管理者が存在してなければ
  if (!await adminApplicationService.isExist()) return res.redirect('/init-admin');

  pageData.headTitle = 'ログイン | HOTATE';
  pageData.csrfToken = req.csrfToken();

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  return res.render('pages/login', {pageData});
});

loginRouter.get('/init-admin', csrfProtection, async (req: Request, res: Response) => {
  // もしも管理者が存在していれば
  if (await adminApplicationService.isExist()) return res.redirect('/');

  pageData.headTitle = '管理者の初期設定 | HOTATE';
  pageData.csrfToken = req.csrfToken();

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/init-admin', {pageData});
});

loginRouter.post('/init-admin', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const pw = req.body.pw;

  try {
    await adminApplicationService.insertAdmin(id, pw);
    req.session.status = {type: 'Success', mes: '管理者の追加に成功しました！'};
    return res.redirect('/login');
  } catch (e: any) {
    req.session.status = {type: 'Failure', mes: '管理者の追加に失敗しました', error: e};
    return res.redirect('/init-admin');
  }
});

/* ログイン処理 */
loginRouter.post('/check', csrfProtection, async (req: Request, res: Response) => {
  try {
    logger.debug('login check');
    if (req.body.id && req.body.pw) {
      const id = req.body.id;
      const pw = req.body.pw;
      const adminData = new AdminData(id, pw);
      const isValid = await adminApplicationService.isValid(adminData);
      if (isValid) {
        /* ログイン成功 */
        logger.info('Login succeeded.');
        const createdToken = admin.create(adminData);
        if (!req.session.token) req.session.token = createdToken;

        req.session.status = {
          type: 'Success',
          mes: 'ログインに成功しました',
        };

        res.redirect('/admin/');
      } else {
        req.session.status = {
          type: 'Warning',
          mes: 'ログインに失敗しました。',
        };
        logger.warn('Login failed.');

        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {
      type: 'Failure',
      error: e,
      mes: 'ログインに失敗しました。',
    };
    res.redirect('/login');
  }
});

export default loginRouter;