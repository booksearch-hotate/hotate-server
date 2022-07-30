import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../domain/service/bookService';
import SearchHistoryService from '../domain/service/searchHistoryService';

import BookApplicationService from '../application/bookApplicationService';
import SearchHistoryApplicationService from '../application/searchHistoryApplicationService';

import BookRepository from '../interface/repository/bookRepository';
import SearchHistoryRepository from '../interface/repository/searchHistoryRepository';

import db from '../infrastructure/db';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import EsSearchHistory from '../infrastructure/elasticsearch/esSearchHistory';

import BookData from '../domain/model/book/bookData';
import SearchHistoryData from '../domain/model/searchHistory/searchHistoryData';

import {IPage} from './datas/IPage';
import {IPaginationData} from './datas/IPaginationData';

import searchMode from './datas/searchModeType';

import getPaginationInfo from '../utils/getPaginationInfo';
import conversionpageCounter from '../utils/conversionPageCounter';
import EsAuthor from '../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../interface/repository/authorRepository';

// eslint-disable-next-line new-cap
const searchRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new BookService(),
);

const searchHistoryApplicationService = new SearchHistoryApplicationService(
    new SearchHistoryRepository(new EsSearchHistory('search_history')),
    new SearchHistoryService(),
);

/* 検索結果 */
searchRouter.get('/search', csrfProtection, async (req: Request, res: Response) => {
  const searchWord = req.query.search as string;
  let searchMode: searchMode = 'none';
  let searchCategory: 'book' | 'author' | 'publisher' = 'book';

  const isStrict = req.query.strict === 'true';
  const isTag = req.query.tag == 'true';
  const formSearchCategory = req.query.type;

  if (isStrict) searchMode = 'strict';
  if (isTag) searchMode = 'tag';
  /* タグ検索とぜったい検索が両方とも選択されている場合、両方とも無効化 */
  if (isTag && isStrict) searchMode = 'none';

  if (typeof formSearchCategory !== 'string') throw new Error('Invalid search category');

  if (formSearchCategory === 'author') searchCategory = 'author';
  else if (formSearchCategory === 'publisher') searchCategory = 'publisher';

  if (searchCategory !== 'book' && searchMode === 'tag') searchMode = 'none';

  const pageCount = conversionpageCounter(req);

  let paginationData: IPaginationData = {
    pageRange: {
      min: 0,
      max: 0,
    },
    totalPage: 0,
    pageCount,
  };

  const FETCH_MARGIN = 9;

  let resDatas: BookData[] = [];
  let searchHisDatas: SearchHistoryData[] = [];
  if (searchWord !== '') {
    const promissList = [
      bookApplicationService.searchBooks(searchWord, searchMode, searchCategory, pageCount, FETCH_MARGIN),
      searchHistoryApplicationService.search(searchWord),
    ];
    const [books, searchHis] = await Promise.all(promissList);
    resDatas = books as BookData[];
    searchHisDatas = searchHis as SearchHistoryData[];

    const total = await bookApplicationService.getTotalResults(searchWord, searchMode);

    paginationData = getPaginationInfo(pageCount, total, FETCH_MARGIN, 7);
  }

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

export default searchRouter;
