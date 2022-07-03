import express, {Application} from 'express';
import expressRateLimit from 'express-rate-limit';
import session from 'express-session';
import dotenv from 'dotenv';
import csurf from 'csurf';
import colors from 'colors/safe';

/* routers */
import homeRouter from '../routers/home';
import requestRouter from '../routers/request';
import bookRouter from '../routers/admin/book';
import adminRouter from '../routers/admin/index';
import searchHistoryRouter from '../routers/admin/searchHistory';
import csvRouter from '../routers/admin/csv';
import tagsRouter from '../routers/admin/tags';
import apiRouter from '../routers/api';
import settingRouter from '../routers/admin/setting';
import departmentRouter from '../routers/admin/department';

import Logger from '../infrastructure/logger/logger';

import {isLocal} from '../infrastructure/cli/cmdLine';

import ResStatus from '../infrastructure/session/status/resStatus';

import ElasticSearch from '../infrastructure/elasticsearch/elasticsearch';

import esDocuments from '../infrastructure/elasticsearch/documents/DocumentType';

const app: Application = express();
const logger = new Logger('system');

const elasticsearchDocuments: esDocuments[] = ['books', 'authors', 'publishers', 'search_history'];

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
    status: ResStatus
  }
}

app.use(express.urlencoded({extended: true})); // POSTで送られてきたデータを解析する
app.use(express.json());
app.use(session({ // lgtm [js/clear-text-cookie]
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

app.use(csurf({cookie: false}));

const esPromiseList = [];

for (const index of elasticsearchDocuments) {
  esPromiseList.push(new ElasticSearch(index).initIndex(false));
}

Promise.all(esPromiseList).catch((e: any) => {
  logger.fatal('Initialization failed.');

  console.log(`
  Elasticsearchの初期化に失敗しました。
  これにより${colors.red('検索エンジンが使えない状況')}となります。
  早急に改善してください。\n
  ↓主要な問題とその解決策↓\n
  ${colors.blue('https://github.com/booksearch-hotate/hotate-server/blob/main/DOC/resolve-problem.md')}
  `);
});

app.use('/', homeRouter);
app.use('/', requestRouter);
app.use('/admin', adminRouter);
app.use('/admin/book', bookRouter);
app.use('/admin/search_history', searchHistoryRouter);
app.use('/admin/csv', csvRouter);
app.use('/admin/tags', tagsRouter);
app.use('/admin/setting', settingRouter);
app.use('/admin/department', departmentRouter);
app.use('/api', apiRouter);

// listen
export function startAppServer(port: number) {
  app.listen(port, () => {
    logger.info('Server is running on port');
    if (isLocal()) console.log(colors.green('現在ローカル環境で動作しています。'));
    console.log(`サーバの起動に成功しました！\nリンク : ${colors.blue(`http://localhost:${port}`)}`);
  });
}
