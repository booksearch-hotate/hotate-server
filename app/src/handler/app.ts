import express, {Application} from 'express';
import expressRateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';

import router from '../routers/router';

import Logger from '../infrastructure/logger/logger';

import {isLocal} from '../infrastructure/cli/cmdLine';

const app: Application = express();
const logger = new Logger('system');

dotenv.config(); // envファイルの読み込み

app.set('view engine', 'ejs'); // テンプレートエンジンの設定
app.use(express.static('public')); // 静的ファイルの設定

/* リクエスト回数に制限を追加 */
const limiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15分間に
  max: 100, // 100回まで
});

// セッションに用いるデータの型を定義
declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    token: string
  }
}

app.use(bodyParser.urlencoded({extended: true})); // POSTで送られてきたデータを解析する
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET as string, // トークンを署名するためのキー
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    // ここに関してはマジでマジックナンバーでも伝わるやろ
    // eslint-disable-next-line no-magic-numbers
    maxAge: 60 * 60 * 1000, // 1時間
    httpOnly: true,
  },
}));

app.use(limiter);

app.use('/', router);

// listen
export function startAppServer(port: number) {
  app.listen(port, () => {
    logger.info(`Server is running on ${port}`);
    if (isLocal()) logger.info('現在ローカルで実行しています');
  });
}
