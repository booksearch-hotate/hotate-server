import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../domain/service/bookService';
import SearchHistoryService from '../domain/service/searchHistoryService';

import BookApplicationService from '../application/BookApplicationService';
import SearchHistoryApplicationService from '../application/SearchHistoryApplicationService';

import BookRepository from '../interface/repository/BookRepository';
import SearchHistoryRepository from '../interface/repository/SearchHistoryRepository';

import db from '../infrastructure/db';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import EsSearchHistory from '../infrastructure/elasticsearch/esSearchHistory';

import BookData from '../application/dto/BookData';
import SearchHistoryData from '../application/dto/SearchHistoryData';

import {IPage} from './datas/IPage';
import {IPaginationData} from './datas/IPaginationData';

import searchMode from './datas/searchModeType';

import getPaginationInfo from '../modules/getPaginationInfo';
import conversionpageCounter from '../modules/conversionPageCounter';

// eslint-disable-next-line new-cap
const searchRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
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

    const total = await bookApplicationService.getTotalResults(searchWord, searchMode);
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

  console.log(resDatas);

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
