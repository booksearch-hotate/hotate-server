import csurf from 'csurf';
import {Router} from 'express';
import passport from 'passport';
import UserApplicationService from '../application/userApplicationService';
import UserRepository from '../interface/repository/userRepository';
import db from '../infrastructure/prisma/prisma';
import Logger from '../infrastructure/logger/logger';
import UserSerive from '../domain/service/userService';

// eslint-disable-next-line new-cap
const userRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('userRouter');

const userApplicationService = new UserApplicationService(
    new UserRepository(db),
    new UserSerive(),
);

userRouter.get('/register', csrfProtection, async (req, res) => {
  res.pageData.headTitle = '利用者登録';
  res.pageData.csrfToken = req.csrfToken();

  res.pageData.anyData = {
    isExistAdmin: await userApplicationService.isExistAdmin(),
  };

  res.render('pages/user/register', {pageData: res.pageData});
});

userRouter.post('/register', csrfProtection, async (req, res) => {
  // eslint-disable-next-line camelcase
  const {id, pw, pw_confirmation} = req.body;

  const isAdmin = req.body.isAdmin === 'true';

  try {
    await userApplicationService.createUser(id, pw, pw_confirmation, isAdmin);
  } catch (e: any) {
    logger.error(e);
    req.flash('error', 'エラーが発生しました。入力内容が正しいか確認の上、もう一度登録してください。');
    res.redirect('/user/register');
    return;
  }

  res.redirect('/user/login');
});


/* ログイン画面 */
userRouter.get('/login', csrfProtection, async (req, res) => {
  if (!!req.user) {
    req.flash('error', 'すでにログインしています。');
    res.redirect('/');
    return;
  }

  res.pageData.headTitle = '利用者ログイン';
  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/user/login', {pageData: res.pageData});
});

userRouter.post('/login', csrfProtection, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true,
  successFlash: true,
}));

/* ログアウト */

userRouter.post('/logout', csrfProtection, (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'ログアウトに失敗しました。詳細はログを確認してください。');
      logger.error(err);
      res.redirect('back');
    } else {
      req.flash('success', 'ログアウトしました。');
      res.redirect('/');
    }
  });
});

/* 変更 */
userRouter.get('/edit', csrfProtection, async (req, res) => {
  if (req.user === undefined) {
    req.flash('error', 'ユーザーの情報を取得中にエラーが発生しました。再度ログインしてください。');
    res.redirect('/user/login');
    return;
  }

  res.pageData.headTitle = '利用者情報変更';
  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/user/edit', {pageData: res.pageData});
});

userRouter.post('/edit', csrfProtection, async (req, res) => {
  // eslint-disable-next-line camelcase
  const {email, pw, pw_confirmation, before_pw} = req.body;

  console.log(email);

  if (req.user === undefined) {
    req.flash('error', 'ユーザーの情報を取得中にエラーが発生しました。再度ログインしてください。');
    res.redirect('/user/login');
    return;
  }

  const userId = (req.user as {id: number}).id;

  try {
    await userApplicationService.updateUser(userId, email, pw, pw_confirmation, before_pw);
  } catch (e: any) {
    req.flash('error', e.message);
    res.redirect('/user/edit');
    return;
  }

  res.redirect('/');
});

export default userRouter;
