import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import multer from 'multer';
import {broadcast} from '../../handler/ws';

import BookService from '../../domain/service/bookService';
import AuthorService from '../../domain/service/authorService';
import PublisherService from '../../domain/service/publisherService';

import BookApplicationService from '../../application/bookApplicationService';
import AuthorApplicationService from '../../application/authorApplicationService';
import PublisherApplicationService
  from '../../application/publisherApplicationService';

import BookRepository from '../../interface/repository/bookRepository';
import AuthorRepository from '../../interface/repository/authorRepository';
import PublisherRepository from '../../interface/repository/publisherRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import CsvFile from '../../infrastructure/fileAccessor/csvFile';
import Logger from '../../infrastructure/logger/logger';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';

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
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

const authorApplicationService = new AuthorApplicationService(
    new AuthorRepository(db, new EsAuthor('authors')),
    new AuthorService(new AuthorRepository(db, new EsAuthor('authors'))),
);

const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsPublisher('publishers')),
    new PublisherService(new PublisherRepository(db, new EsPublisher('publishers'))),
);

/* csvファイル選択画面 */
csvRouter.get('/choice', csrfProtection, (req: Request, res: Response) => {
  pageData.headTitle = 'CSVファイル選択';
  pageData.csrfToken = req.csrfToken();

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
csvRouter.post('/sendFile', csrfProtection, upload.single('csv'), async (req, res: Response) => {
  const file = req.file;

  try {
    csvFile.File = file;
    logger.info('csv file retrieved.');
  } catch (err) {
    logger.error('Failed to retrieve csv file.');
  }

  res.redirect('/admin/csv/headerChoice');
});

/* csvファイルからDBへ登録する作業 */
csvRouter.post('/formHader', csrfProtection, async (req: Request, res: Response) => {
  try {
    logger.trace('getting csv file.');
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

    logger.trace('start to input books data.');

    const startTimer = performance.now();

    const csvLengh = csv.length;

    const booksPromise = [];

    for (let i = 0; i < csvLengh; i++) {
      const row = csv[i];

      const authorName = row[req.body.authorName];
      const publisherName = row[req.body.publisherName];

      const authorId = await authorApplicationService.createAuthor(authorName, true);

      const publisherId = await publisherApplicationService.createPublisher(publisherName, true);

      for (const item in req.body) if (req.body[item] === undefined) req.body[item] = null;

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
      ).catch((e: any) => {
        logger.error(`Failed to add book.  bookName: ${row[req.body.bookName]}`);
      }));

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

    logger.trace('starting send bulk api.');

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

    logger.trace(`It took ${endTimer - startTimer}ms to register the csv file.`);
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
