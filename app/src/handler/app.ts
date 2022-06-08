import express, {Application} from 'express';
import expressRateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import session from 'express-session';
import dotenv from 'dotenv';

/* routers */
import homeRouter from '../routers/home';
import bookRouter from '../routers/admin/book';
import adminRouter from '../routers/admin/index';
import searchHistoryRouter from '../routers/admin/searchHistory';
import csvRouter from '../routers/admin/csv';
import tagsRouter from '../routers/admin/tags';
import apiRouter from '../routers/api';

import Logger from '../infrastructure/logger/logger';

import {isLocal} from '../infrastructure/cli/cmdLine';

const app: Application = express();
const logger = new Logger('system');

dotenv.config(); // envファイルの読み込み

app.set('view engine', 'ejs'); // テンプレートエンジンの設定
app.use(express.static('public')); // 静的ファイルの設定

/* リクエスト回数に制限を追加 */
const limiter = expressRateLimit({
  windowMs: 60 * 1000, // 1分間に
  max: 1000, // 100回まで
});

// セッションに用いるデータの型を定義
declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    token: string,
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
  },
}));

app.use(limiter);

app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/admin/book', bookRouter);
app.use('/admin/search_history', searchHistoryRouter);
app.use('/admin/csv', csvRouter);
app.use('/admin/tags', tagsRouter);
app.use('/api', apiRouter);

// listen
export function startAppServer(port: number) {
  app.listen(port, () => {
    logger.info(`Server is running on ${port}`);
    if (isLocal()) logger.info('現在ローカルで実行しています');
  });
}
