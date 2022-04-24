import express, {Application, Request, Response } from 'express';

const app: Application = express();
const PORT = 8080;

app.set('view engine', 'ejs'); // テンプレートエンジンの設定
app.use(express.static('public')); // 静的ファイルの設定

/* ルーティング */

// listen
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
