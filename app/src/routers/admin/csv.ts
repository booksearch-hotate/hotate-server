import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import multer from 'multer';
import {broadcast} from '../../handler/websocket';

import BookService from '../../domain/service/bookService';
import TagService from '../../domain/service/tagService';
import AuthorService from '../../domain/service/authorService';
import PublisherService from '../../domain/service/publisherService';

import BookApplicationService from '../../application/BookApplicationService';
import TagApplicationService from '../../application/TagApplicationService';
import AuthorApplicationService from '../../application/AuthorApplicationService';
import PublisherApplicationService
  from '../../application/PublisherApplicationService';

import BookRepository from '../../interface/repository/BookRepository';
import TagRepository from '../../interface/repository/TagRepository';
import AuthorRepository from '../../interface/repository/AuthorRepository';
import PublisherRepository from '../../interface/repository/PublisherRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esSearchBook';
import CsvFile from '../../infrastructure/fileAccessor/csvFile';
import Logger from '../../infrastructure/logger/logger';
import EsCsv from '../../infrastructure/elasticsearch/esCsv';

import {IPage} from '../datas/IPage';


// eslint-disable-next-line new-cap
const csvRouter = Router();

const csvFile = new CsvFile();

const upload = multer({dest: './uploads/csv/'}); // multerの設定

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('csv');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new TagService(new TagRepository(db)),
);

const authorApplicationService = new AuthorApplicationService(
    new AuthorRepository(db, new EsCsv('authors')),
    new AuthorService(new AuthorRepository(db, new EsCsv('authors'))),
);

const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsCsv('publishers')),
    new PublisherService(new PublisherRepository(db, new EsCsv('publishers'))),
);

/* csvファイル選択画面 */
csvRouter.get('/choice', (req: Request, res: Response) => {
  pageData.headTitle = 'CSVファイル選択';

  res.render('pages/admin/csv/choice', {pageData});
});

/* csvファイルのヘッダを選択する画面 */
csvRouter.get('/headerChoice', csrfProtection, async (req: Request, res: Response) => {
  try {
    pageData.anyData = {csvHeader: await csvFile.getHeaderNames()};
    pageData.headTitle = 'CSVファイルヘッダー選択';
    pageData.csrfToken = req.csrfToken();

    res.render('pages/admin/csv/headerChoice', {pageData});
  } catch (e) {
    res.redirect('/admin/csv/choice');
  }
});

/* ローディング画面 */
csvRouter.get('/loading', (req: Request, res: Response) => {
  if (!csvFile.isExistFile()) return res.redirect('/admin/');

  pageData.headTitle = '読み込み中...';

  return res.render('pages/admin/csv/loading', {pageData});
});

/* csvファイルの受け取り */
csvRouter.post('/sendFile', upload.single('csv'), async (req, res: Response) => {
  const file = req.file;

  try {
    csvFile.File = file;
    logger.info('CSVファイルを受信しました。');
  } catch (err) {
    logger.error('CSVファイルの受信に失敗しました。');
  }

  res.redirect('/admin/csv/headerChoice');
});

/* csvファイルからDBへ登録する作業 */
csvRouter.post('/formHader', csrfProtection, async (req: Request, res: Response) => {
  try {
    const csv = await csvFile.getFileContent(); // csvファイルの内容を取得
    if (csvFile.File !== undefined) res.redirect('/admin/csv/loading');
    else res.redirect('/admin/csv/choice');

    broadcast({
      progress: 'init',
      data: {
        current: -1,
        total: -1,
      },
    });


    const startTimer = performance.now();
    if (req.body.initData === 'true') {
      /* 初期化 */
      if (await tagApplicationService.isExistTable()) await tagApplicationService.deleteAll();
      await bookApplicationService.deleteBooks();
      await publisherApplicationService.deletePublishers();
      await authorApplicationService.deleteAuthors();
    }
    const csvLengh = csv.length;

    const booksPromise = [];

    for (let i = 0; i < csvLengh; i++) {
      const row = csv[i];

      const authorName = row[req.body.authorName];
      const publisherName = row[req.body.publisherName];

      const authorId = await authorApplicationService.createAuthor(authorName);

      const publisherId = await publisherApplicationService.createPublisher(publisherName);

      booksPromise.push(bookApplicationService.createBook(
          row[req.body.bookName],
          row[req.body.bookSubName],
          row[req.body.bookContent],
          row[req.body.isbn],
          row[req.body.ndc],
          row[req.body.year],
          authorId,
          authorName,
          publisherId,
          publisherName,
      ));

      if (i % 50 == 0) { // 50件ごとにブロードキャスト
        broadcast({
          progress: 'progress',
          data: {
            current: i,
            total: csvLengh,
          },
        });
      }
    }

    await Promise.all(booksPromise);

    /* bulk apiの実行 */
    const bulkApis = [
      bookApplicationService.executeBulkApi(),
      authorApplicationService.executeBulkApi(),
      publisherApplicationService.executeBulkApi(),
    ];
    await Promise.all(bulkApis);

    // 完了したことをwsで飛ばす
    broadcast({
      progress: 'complete',
      data: {
        current: csvLengh,
        total: csvLengh,
      },
    });
    const endTimer = performance.now();
    logger.info(`CSVファイルの読み込みに ${endTimer - startTimer}ms で終了しました。`);
  } catch (e) {
    logger.error(e as string);

    broadcast({
      progress: 'error',
      data: {
        current: 0,
        total: 0,
      },
    });
  } finally {
    csvFile.deleteFiles(); // csvファイルを削除
  }
});

export default csvRouter;
