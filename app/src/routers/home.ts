import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../domain/service/bookService';
import SearchHistoryService from '../domain/service/searchHistoryService';
import AdminService from '../domain/service/adminService';
import TagService from '../domain/service/tagService';

import BookApplicationService from '../application/BookApplicationService';
import SearchHistoryApplicationService from '../application/SearchHistoryApplicationService';
import AdminApplicationService from '../application/AdminApplicationService';
import TagApplicationService from '../application/TagApplicationService';

import BookRepository from '../interface/repository/BookRepository';
import SearchHistoryRepository from '../interface/repository/SearchHistoryRepository';
import AdminRepository from '../interface/repository/AdminRepository';
import TagRepository from '../interface/repository/TagRepository';


import db from '../infrastructure/db';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import EsSearchHistory from '../infrastructure/elasticsearch/esSearchHistory';
import Logger from '../infrastructure/logger/logger';
import AdminSession from '../infrastructure/session';

import AdminData from '../application/dto/AdminData';
import BookData from '../application/dto/BookData';
import SearchHistoryData from '../application/dto/SearchHistoryData';

import {IPage} from './datas/IPage';
import {IPaginationData} from './datas/IPaginationData';

import getPaginationInfo from '../modules/getPaginationInfo';
import conversionpageCounter from '../modules/conversionPageCounter';
import conversionpageStatus from '../modules/conversionPageStatus';

// eslint-disable-next-line new-cap
const homeRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const admin = new AdminSession();

const logger = new Logger('home');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

const searchHistoryApplicationService = new SearchHistoryApplicationService(
    new SearchHistoryRepository(new EsSearchHistory('search_history')),
    new SearchHistoryService(),
);

const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new TagService(new TagRepository(db)),
);

homeRouter.get('/', (req: Request, res: Response) => {
  pageData.headTitle = 'ホーム | HOTATE';

  res.render('pages/index', {pageData});
});

/* 検索結果 */
homeRouter.get('/search', csrfProtection, async (req: Request, res: Response) => {
  const searchWord = req.query.search as string;
  type searchMode = 'strict' | 'tag' | 'none';
  let searchMode: searchMode = 'none';

  const isStrict = req.query.strict === 'true';
  const isTag = req.query.tag == 'true';

  if (isStrict) searchMode = 'strict';
  if (isTag) searchMode = 'tag';
  /* タグ検索とぜったい検索が両方とも選択されている場合、両方とも無効化 */
  if (isTag && isStrict) searchMode = 'none';

  const pageCount = conversionpageCounter(req);
  let totalPage = 0;
  let minPage = 0;
  let maxPage = 0;

  let resDatas: BookData[] = [];
  let searchHisDatas: SearchHistoryData[] = [];
  if (searchWord !== '') {
    const promissList = [
      bookApplicationService.searchBooks(searchWord, searchMode, pageCount),
      searchHistoryApplicationService.search(searchWord),
    ];
    const [books, searchHis] = await Promise.all(promissList);
    resDatas = books as BookData[];
    searchHisDatas = searchHis as SearchHistoryData[];

    const total = await bookApplicationService.getTotalResults(searchWord, isStrict, isTag);
    const paginationInfo = getPaginationInfo(pageCount, total);
    totalPage = paginationInfo.totalPage;
    minPage = paginationInfo.minPage;
    maxPage = paginationInfo.maxPage;
  }

  const paginationData: IPaginationData = {
    pageRange: {
      min: minPage,
      max: maxPage,
    },
    totalPage,
    pageCount,
  };

  pageData.headTitle = '検索結果 | HOTATE';
  pageData.anyData = {
    searchRes: resDatas,
    searchHis: searchHisDatas,
    searchWord,
    paginationData,
    isStrict,
    isTag,
  };
  pageData.csrfToken = req.csrfToken();

  if (!isStrict && !isTag) searchHistoryApplicationService.add(searchWord);

  res.render('pages/search', {pageData});
});

/* 本詳細画面 */
homeRouter.get('/item/:bookId', csrfProtection, async (req: Request, res: Response) => {
  const id = req.params.bookId; // 本のID
  let bookData: BookData;
  const isLogin = admin.verifyToken(req.session.token);
  try {
    bookData = await bookApplicationService.searchBookById(id);
    pageData.headTitle = `${bookData.BookName} | HOTATE`;
    pageData.anyData = {bookData, isError: false, isLogin};

    pageData.csrfToken = req.csrfToken();
  } catch {
    logger.warn(`Not found bookId: ${id}`);
    pageData.headTitle = '本が見つかりませんでした。';
    pageData.anyData = {isError: true};
  } finally {
    pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render('pages/item', {pageData});
  }
});

/* タグ追加処理 */
homeRouter.post('/tag/insert', csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;
  try {
    const name: string = req.body.tagName;
    const isExist = await tagApplicationService.create(name, bookId);
    if (isExist) req.session.status = {type: 'Warning', mes: `${name}は既に登録されています`};
    else req.session.status = {type: 'Success', mes: `${name}の登録が完了しました`};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '登録に失敗しました'};
  } finally {
    res.redirect(`/item/${bookId}`);
  }
});

/* ログイン画面 */
homeRouter.get('/login', csrfProtection, (req: Request, res: Response) => {
  if (admin.verifyToken(req.session.token)) return res.redirect('/admin/');

  pageData.headTitle = 'ログイン | HOTATE';
  pageData.csrfToken = req.csrfToken();

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  return res.render('pages/login', {pageData});
});

/* ログイン処理 */
homeRouter.post('/check', csrfProtection, async (req: Request, res: Response) => {
  try {
    logger.debug('login check');
    if (req.body.id && req.body.pw) {
      const id = req.body.id;
      const pw = req.body.pw;
      const adminData = new AdminData(id, pw);
      const isValid = await adminApplicationService.isValid(adminData);
      if (isValid) {
        /* ログイン成功 */
        logger.info('Login succeeded.');
        const createdToken = admin.create(adminData);
        if (!req.session.token) req.session.token = createdToken;

        req.session.status = {
          type: 'Success',
          mes: 'ログインに成功しました',
        };

        res.redirect('/admin/');
      } else {
        logger.warn('Login failed.');

        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {
      type: 'Failure',
      error: e,
      mes: 'ログインに失敗しました。',
    };
    res.redirect('/login');
  }
});

export default homeRouter;
