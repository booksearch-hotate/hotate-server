/* package */
import {Request, Response, Router, NextFunction} from 'express';
import multer from 'multer';
import {broadcast} from '../handler/websocket';
import csurf from 'csurf';
import {performance} from 'perf_hooks';

/* domain service */
import BookService from '../domain/service/bookService';
import AuthorService from '../domain/service/authorService';
import PublisherService from '../domain/service/publisherService';
import AdminService from '../domain/service/adminService';
import SearchHistoryService from '../domain/service/searchHistoryService';
import TagService from '../domain/service/tagService';

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
import State from '../infrastructure/state';

/* DTO */
import AdminData from '../application/dto/AdminData';
import BookData from '../application/dto/BookData';
import SearchHistoryData from '../application/dto/SearchHistoryData';

// eslint-disable-next-line new-cap
const router = Router(); // ルーティング
const upload = multer({dest: './uploads/csv/'}); // multerの設定
const logger = new Logger('router'); // loggerのインスタンス化
const csvFile = new CsvFile();

/* アプリケーションサービスの初期化 */
const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);
const authorApplicationService = new AuthorApplicationService(
    new AuthorRepository(db, new EsCsv('authors')),
    new AuthorService(new AuthorRepository(db, new EsCsv('authors'))),
);
const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsCsv('publishers')),
    new PublisherService(new PublisherRepository(db, new EsCsv('publishers'))),
);
const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);
const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new TagService(new TagRepository(db)),
);
const searchHistoryApplicationService = new SearchHistoryApplicationService(
    new SearchHistoryRepository(new EsSearchHistory('search_history')),
    new SearchHistoryService(),
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

const stateManager = new State();

/**
 * originを取得
 */
const inputOriginData = (req: Request, res: Response, next: NextFunction) => {
  pageData = {
    headTitle: '',
    path: req.url,
    origin: req.protocol + '://' + req.headers.host,
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

/* 検索結果 */
router.get('/search', async (req: Request, res: Response) => {
  const searchWord = req.query.search as string;
  let isStrict = req.query.strict === 'true'; // mysqlによるLIKE検索かどうか
  let isTag = req.query.tag === 'true'; // タグ検索かどうか

  if (isTag && isStrict) {
    isStrict = isTag = false;
  }

  let pageCount = Number(req.query.page as string);
  let totalPage = 0;
  let minPage = 0;
  let maxPage = 0;

  if (isNaN(pageCount)) pageCount = 0;
  else pageCount--;

  if (pageCount <= 0) pageCount = 0;

  let resDatas: BookData[] = [];
  let searchHisDatas: SearchHistoryData[] = [];
  if (searchWord !== '') {
    const promissList = [
      bookApplicationService.searchBooks(searchWord, isStrict, isTag, pageCount),
      searchHistoryApplicationService.search(searchWord),
    ];
    const [books, searchHis] = await Promise.all(promissList);
    resDatas = books as BookData[];
    searchHisDatas = searchHis as SearchHistoryData[];

    const total = await bookApplicationService.getTotalResults(searchWord, isStrict, isTag);
    totalPage = Math.ceil(total / 10); // 最大ページ数
    minPage = Math.max(pageCount - 3, 1); // 最小ページ数
    maxPage = Math.min(Math.max(7 - minPage + 1, pageCount + 3), totalPage); // 最大ページ数
  }

  pageData.headTitle = '検索結果 | HOTATE';
  pageData.anyData = {
    searchRes: resDatas,
    searchHis: searchHisDatas,
    searchWord,
    pageRange: {
      min: minPage,
      max: maxPage,
    },
    totalPage,
    pageCount,
    isStrict,
    isTag,
  };

  if (!isStrict && !isTag) searchHistoryApplicationService.add(searchWord);

  res.render('pages/search', {pageData});
});

/* 本詳細画面 */
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

/* ログイン画面 */
router.get('/login', csrfProtection, (req: Request, res: Response) => {
  if (admin.verify(req.session.token)) return res.redirect('/admin/');
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

/* ログイン処理 */
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
        res.redirect('/admin/');
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

/* 管理者用ホーム画面 */
router.get('/admin/', (req: Request, res: Response) => {
  pageData.headTitle = '管理画面';
  res.render('pages/admin/', {pageData});
});

/* タグ管理画面 */
router.get('/admin/tags', csrfProtection, async (req: Request, res: Response) => {
  const tags = await tagApplicationService.findAll();

  const stateValue = stateManager.get('tagEdit');

  if (stateValue) stateManager.delete('tagEdit');

  pageData.headTitle = 'タグ管理';
  pageData.anyData = {tags, stateValue};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/index', {pageData});
});

/* タグの削除 */
router.post('/admin/tags/delete', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  await tagApplicationService.delete(id);

  stateManager.add('tagEdit', 'delete');

  res.redirect('/admin/tags');
});

/* タグの編集画面 */
router.get('/admin/tags/edit', csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== 'string') return res.redirect('/admin/tags');

  const tag = await tagApplicationService.findById(id);

  pageData.headTitle = 'タグ編集';
  pageData.anyData = {tag};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/edit', {pageData});
});

/* タグの編集処理 */
router.post('/admin/tags/update', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const name = req.body.name;

  if (name === '') return res.redirect(`/admin/tags/edit?id=${id}`);

  await tagApplicationService.update(id, name);

  stateManager.add('tagEdit', 'update');

  res.redirect('/admin/tags');
});

/* 検索履歴一覧画面 */
router.get('/admin/search_history/', csrfProtection, async (req: Request, res: Response) => {
  let pageCount = Number(req.query.page as string);
  if (isNaN(pageCount)) pageCount = 0;
  const searchHistory = await searchHistoryApplicationService.find(pageCount);

  pageData.headTitle = '検索履歴';
  pageData.anyData = {searchHistory};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/search_history/index', {pageData});
});

/* 検索履歴削除 */
router.post('/admin/search_history/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    await searchHistoryApplicationService.delete(id);
  } catch (e) {
    logger.error(e as string);
  }

  res.redirect('/admin/search_history/');
});

/* csvファイル選択画面 */
router.get('/admin/csv/choice', (req: Request, res: Response) => {
  pageData.headTitle = 'CSVファイル選択';

  res.render('pages/admin/csv/choice', {pageData});
});

/* csvファイルのヘッダを選択する画面 */
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

/* ローディング画面 */
router.get('/admin/csv/loading', (req: Request, res: Response) => {
  if (!csvFile.isExistFile()) return res.redirect('/admin/');

  pageData.headTitle = '読み込み中...';

  return res.render('pages/admin/csv/loading', {pageData});
});

/* csvファイルの受け取り */
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

/* csvファイルからDBへ登録する作業 */
router.post('/admin/csv/formHader', csrfProtection, async (req: Request, res: Response) => {
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

/**
===
API
===
**/

/* isbnに対応する画像をopenbdから取得 */
router.post('/api/:isbn/imgLink', async (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  let imgLink = await bookApplicationService.getImgLink(isbn);
  if (imgLink === null) imgLink = '';
  res.json({imgLink});
});

/* 本IDに対応するタグを作成 */
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
