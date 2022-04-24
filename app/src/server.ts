import express, {Application, Request, Response } from 'express';

import { IPage } from './interfaces/IPage';

import CssPathMake from './modules/CssPathMake';
import JsPathMake from './modules/JsPathMake';
import OriginMake from './modules/OriginMake';

const app: Application = express();
const PORT = 8080;

app.set('view engine', 'ejs'); // テンプレートエンジンの設定
app.use(express.static('public')); // 静的ファイルの設定

let pageData: IPage;

/* ルーティング */
app.get('/', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ホーム | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['index'], OriginMake(req)).make()
  }
  res.render('pages/index', {pageData});
});

// listen
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
