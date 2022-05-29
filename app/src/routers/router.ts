/* package */
import {Request, Response, Router, NextFunction} from 'express';
import multer from 'multer';
import {broadcast} from '../handler/websocket';
import csurf from 'csurf';

/* module */
import originMake from '../modules/origin';

/* application searvice */
import BookApplicationService from '../application/BookApplicationService';
import AuthorApplicationService from '../application/AuthorApplicationService';
import PublisherApplicationService
  from '../application/PublisherApplicationService';
import AdminApplicationService from '../application/AdminApplicationService';
import SearchHistoryApplicationService from '../application/SearchHistoryApplicationService';
import TagApplicationService from '../application/TagApplicationService';

/* repository */
import BookRepository from '../interface/repository/BookRepository';
import AuthorRepository from '../interface/repository/AuthorRepository';
import PublisherRepository from '../interface/repository/PublisherRepository';
import AdminRepository from '../interface/repository/AdminRepository';
import SearchHistoryRepository from '../interface/repository/SearchHistoryRepository';
import TagRepository from '../interface/repository/TagRepository';

/* infrastructure */
import CsvFile from '../infrastructure/fileAccessor/csvFile';
import AdminSession from '../infrastructure/session';
import Logger from '../infrastructure/logger/logger';
import db from '../infrastructure/db';
import EsCsv from '../infrastructure/elasticsearch/esCsv';
import EsSearchBook from '../infrastructure/elasticsearch/esSearchBook';
import EsSearchHistory from '../infrastructure/elasticsearch/esSearchHistory';

/* DTO */
import AdminData from '../application/dto/AdminData';
import BookData from '../application/dto/BookData';

// eslint-disable-next-line new-cap
const router = Router(); // ルーティング
const upload = multer({dest: './uploads/csv/'}); // multerの設定
const logger = new Logger('router'); // loggerのインスタンス化
const csvFile = new CsvFile();

/* アプリケーションサービスの初期化 */
const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
);
const authorApplicationService = new AuthorApplicationService(
    new AuthorRepository(db, new EsCsv('authors')),
);
const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsCsv('publishers')),
);
const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
);
const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
);
const searchHistoryApplicationService = new SearchHistoryApplicationService(
    new SearchHistoryRepository(new EsSearchHistory('search_history')),
);

/* ejsにデータを渡す際に使用するオブジェクト */
interface IPage {
  headTitle: string; // ページのタイトル
  path: string;
  pathName?: string;
  origin?: string;
  csrfToken: string;
  anyData?: unknown; // その他のデータ
}

let pageData: IPage;

const admin = new AdminSession();

/**
 * originを取得
 */
const inputOriginData = (req: Request, res: Response, next: NextFunction) => {
  pageData = {
    headTitle: '',
    path: req.url,
    origin: originMake(req),
    csrfToken: '',
  };
  next();
};

const csrfProtection = csurf({cookie: false});

router.use(inputOriginData);

/* ルーティング */
router.get('/', (req: Request, res: Response) => {
  pageData.headTitle = 'ホーム | HOTATE';

  res.render('pages/index', {pageData});
});

router.get('/search', async (req: Request, res: Response) => {
  const searchWord = req.query.search as string;
  const isStrict = req.query.strict === 'true'; // mysqlによるLIKE検索かどうか
  const isTag = req.query.tag === 'true'; // タグ検索かどうか
  let resDatas: BookData[] = [];
  let searchHisDatas: string[] = [];
  if (searchWord !== '') {
    resDatas = await bookApplicationService.searchBooks(searchWord, isStrict, isTag);
    searchHisDatas = await searchHistoryApplicationService.search(searchWord);
  }
  pageData.headTitle = '検索結果 | HOTATE';
  pageData.anyData = {searchRes: resDatas, searchHis: searchHisDatas};
  await searchHistoryApplicationService.add(searchWord);

  res.render('pages/search', {pageData});
});

router.get('/item/:bookId', async (req: Request, res: Response) => {
  const id = req.params.bookId; // 本のID
  let bookData: BookData;
  try {
    bookData = await bookApplicationService.searchBookById(id);
    pageData.headTitle = `${bookData.BookName} | HOTATE`;
    pageData.anyData = {bookData, isError: false};
  } catch {
    logger.warn(`Not found bookId: ${id}`);
    pageData.headTitle = '本が見つかりませんでした。';
    pageData.anyData = {isError: true};
  } finally {
    res.render('pages/item', {pageData});
  }
});

router.get('/login', csrfProtection, (req: Request, res: Response) => {
  if (admin.verify(req.session.token)) return res.redirect('/admin/home');
  pageData.headTitle = 'ログイン | HOTATE';
  pageData.anyData = {loginStatus: admin.LoginStatus};
  pageData.csrfToken = req.csrfToken();

  return res.render('pages/login', {pageData});
});

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
const authCheckMiddle = (req: Request, res: Response, next: NextFunction) => {
  if (admin.verify(req.session.token)) {
    next();
  } else {
    logger.info('トークンが無効です。ログインページへリダイレクトします。');
    admin.LoginStatus = 'miss';
    res.redirect('/login');
  }
};

/**
 * ログイン処理を行う関数
*/
router.post('/check', csrfProtection, async (req: Request, res: Response) => {
  try {
    logger.debug('check');
    if (req.body.id && req.body.pw) {
      const id = req.body.id;
      const pw = req.body.pw;
      const adminData = new AdminData(id, pw);
      const isValid = await adminApplicationService.isValid(adminData);
      if (isValid) {
        logger.info('ログインに成功しました。');
        admin.create(adminData);
        admin.LoginStatus = 'login';
        if (!req.session.token) req.session.token = admin.Token;
        res.redirect('/admin/home');
      } else {
        logger.warn('ログインに失敗しました。');
        admin.LoginStatus = 'miss';
        res.redirect('/login');
      }
    } else {
      admin.LoginStatus = 'miss';
      res.redirect('/login');
      logger.warn('直接ログインしようとしました。');
    }
  } catch (e) {
    logger.error(e as string);
    admin.LoginStatus = 'error';
    res.redirect('/login');
  }
});

// uriの始まりがauthのときに認証を行う
router.use('/admin', authCheckMiddle);

router.get('/admin/home', (req: Request, res: Response) => {
  pageData.headTitle = '管理画面';
  res.render('pages/admin/home', {pageData});
});

router.get('/admin/tags', async (req: Request, res: Response) => {
  const tags = await tagApplicationService.findAll();

  pageData.headTitle = 'タグ管理';
  pageData.anyData = {tags};
  res.render('pages/admin/tags/index', {pageData});
});

router.post('/admin/tags/delete', async (req: Request, res: Response) => {
  const id = req.body.id;
  await tagApplicationService.delete(id);

  res.redirect('/admin/tags');
});

router.get('/admin/csv/choice', (req: Request, res: Response) => {
  pageData.headTitle = 'CSVファイル選択';

  res.render('pages/admin/csv/choice', {pageData});
});

router.get('/admin/csv/headerChoice', csrfProtection, async (req: Request, res: Response) => {
  try {
    pageData.anyData = {csvHeader: await csvFile.getHeaderNames()};
    pageData.headTitle = 'CSVファイルヘッダー選択';
    pageData.csrfToken = req.csrfToken();

    res.render('pages/admin/csv/headerChoice', {pageData});
  } catch (e) {
    logger.error(e as string);
    res.redirect('/admin/csv/choice');
  }
});

router.get('/admin/csv/loading', (req: Request, res: Response) => {
  if (!csvFile.isExistFile()) return res.redirect('/admin/home');

  pageData.headTitle = '読み込み中...';

  return res.render('pages/admin/csv/loading', {pageData});
});


router.post('/admin/csv/sendFile', upload.single('csv'), async (req, res: Response) => {
  const file = req.file;

  try {
    csvFile.File = file;
    logger.info('CSVファイルを受信しました。');
  } catch (err) {
    logger.error('CSVファイルの受信に失敗しました。');
  }

  res.redirect('/admin/csv/headerChoice');
});

router.post('/admin/csv/formHader', csrfProtection, async (req: Request, res: Response) => {
  try {
    const csv = await csvFile.getFileContent(); // csvファイルの内容を取得
    if (csvFile.File !== undefined) res.redirect('/admin/csv/loading');

    broadcast({
      progress: 'init',
      data: {
        current: -1,
        total: -1,
      },
    });

    /* 初期化 */
    await bookApplicationService.deleteBooks();
    await publisherApplicationService.deletePublishers();
    await authorApplicationService.deleteAuthors();

    const csvLengh = csv.length;

    for (let i = 0; i < csvLengh; i++) {
      const row = csv[i];

      const authorName = row[req.body.authorName];
      const publisherName = row[req.body.publisherName];

      const authorId = await authorApplicationService.createAuthor(authorName);

      const publisherId = await publisherApplicationService.createPublisher(publisherName);

      await bookApplicationService.createBook(
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
      );

      broadcast({
        progress: 'progress',
        data: {
          current: i,
          total: csvLengh,
        },
      });
    }

    /* bulk apiの実行 */
    await authorApplicationService.executeBulkApi();
    await publisherApplicationService.executeBulkApi();
    await bookApplicationService.executeBulkApi();

    // 完了したことをwsで飛ばす
    broadcast({
      progress: 'complete',
      data: {
        current: csvLengh,
        total: csvLengh,
      },
    });
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

/*
===
API
===
*/

router.post('/api/:isbn/imgLink', async (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  let imgLink = await bookApplicationService.getImgLink(isbn);
  if (imgLink === null) imgLink = '';
  res.json({imgLink});
});

router.post('/api/:bookId/tag', async (req: Request, res: Response) => {
  let status = '';
  try {
    const name: string = req.body.name;
    const bookId = req.params.bookId;
    const isExist = await tagApplicationService.create(name, bookId);
    status = isExist ? 'duplicate' : 'success';
    res.json({status});
  } catch (e) {
    logger.error(e as string);
    status = 'error';
    res.json({status});
  }
});

export default router;
