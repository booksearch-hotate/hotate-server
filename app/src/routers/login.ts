import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import AdminService from '../domain/service/adminService';

import AdminApplicationService from '../application/adminApplicationService';

import AdminRepository from '../interface/repository/adminRepository';

import db from '../infrastructure/db';
import AdminSession from '../presentation/session';

import conversionpageStatus from '../utils/conversionPageStatus';
import passport from 'passport';

// eslint-disable-next-line new-cap
const loginRouter = Router();

const csrfProtection = csurf({cookie: false});

const admin = new AdminSession();

const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);

/* ログイン画面 */
loginRouter.get('/login', csrfProtection, async (req: Request, res: Response) => {
  if (admin.verifyToken(req.session.token)) return res.redirect('/admin/');

  // もしも管理者が存在してなければ
  if (!await adminApplicationService.isExist()) return res.redirect('/init-admin');

  res.pageData.headTitle = 'ログイン ';
  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  return res.render('pages/login', {pageData: res.pageData});
});

loginRouter.get('/init-admin', csrfProtection, async (req: Request, res: Response) => {
  // もしも管理者が存在していれば
  if (await adminApplicationService.isExist()) return res.redirect('/');

  res.pageData.headTitle = '管理者の初期設定 ';
  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/init-admin', {pageData: res.pageData});
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
loginRouter.post('/check', csrfProtection, passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true,
}));

export default loginRouter;
