import express, {Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

import { IPage } from './interfaces/IPage';

import CssPathMake from './modules/CssPathMake';
import JsPathMake from './modules/JsPathMake';
import OriginMake from './modules/OriginMake';
import AuthModule from './modules/AuthModule';
import MysqlModule from './modules/MysqlModule';

const app: Application = express();

const auth = new AuthModule();

const PORT = 8080;

app.set('view engine', 'ejs'); // テンプレートエンジンの設定
app.use(express.static('public')); // 静的ファイルの設定

let pageData: IPage;

// セッションに用いるデータの型を定義
declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    token: string
  }
}

app.use(bodyParser.urlencoded({ extended: true })) // POSTで送られてきたデータを解析する
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET as string, // トークンを署名するためのキー
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // 1時間
  }
}))

/* ルーティング */
app.get('/', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ホーム | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['index'], OriginMake(req)).make()
  }
  res.render('pages/index', {pageData});
});

app.get('/login', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ログイン | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['login'], OriginMake(req)).make()
  }
  res.render('pages/login', {pageData});
})

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
 const authCheckMiddle = (req: Request, res: Response, next: NextFunction) => {
  if (auth.verifyToken(req.session.token as string) || req.body.id !== null && req.body.pw !== null) next()
  else res.redirect('/login')
}

// uriの始まりがauthのときに認証を行う
app.use('/auth', authCheckMiddle)

/**
 * ログイン処理を行う関数
*/
app.post('/auth/check', (req: Request, res: Response) => {
  if (req.body.id && req.body.pw) {
    const id = req.body.id
    const pw = req.body.pw
    const isLogin = auth.loginFlow(id, pw)
    if (isLogin) {
      if (!req.session.token) req.session.token = auth.getToken() // トークンの格納
      res.redirect('/auth/home')
    } else {
      res.redirect('/login')
    }
  } else {
    res.redirect('/login')
  }
})

app.get('/auth/home', (req: Request, res: Response) => {
  pageData = {
    headTitle: '管理画面',
    path: req.url,
    cssData: new CssPathMake(['auth/home'], OriginMake(req)).make()
  }
  res.render('pages/auth/home', { pageData })
})

// uriの始まりがauthのときに認証を行う
app.use('/auth', authCheckMiddle)

// listen
// eslint-disable-next-line no-console
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
