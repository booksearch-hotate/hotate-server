import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import SearchHistoryService from '../../domain/service/searchHistoryService';

import SearchHistoryApplicationService from '../../application/searchHistoryApplicationService';

import SearchHistoryRepository from '../../interface/repository/searchHistoryRepository';


import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';

import {IPage} from '../datas/IPage';
import {IPaginationData} from '../datas/IPaginationData';

import getPaginationInfo from '../../modules/getPaginationInfo';
import conversionpageCounter from '../../modules/conversionPageCounter';

// eslint-disable-next-line new-cap
const searchHistoryRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const searchHistoryApplicationService = new SearchHistoryApplicationService(
    new SearchHistoryRepository(new EsSearchHistory('search_history')),
    new SearchHistoryService(),
);

/* 検索履歴一覧画面 */
searchHistoryRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const searchHistory = await searchHistoryApplicationService.find(pageCount);
  const total = await searchHistoryApplicationService.findAllCount();

  const paginationInfo = getPaginationInfo(pageCount, total);

  const paginationData: IPaginationData = {
    pageRange: {
      min: paginationInfo.minPage,
      max: paginationInfo.maxPage,
    },
    totalPage: paginationInfo.totalPage,
    pageCount,
  };

  pageData.headTitle = '検索履歴';
  pageData.anyData = {
    searchHistory,
    paginationData,
  };
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/search-history/index', {pageData});
});

/* 検索履歴削除 */
searchHistoryRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    await searchHistoryApplicationService.delete(id);
  } catch (e) {
  }

  res.redirect('/admin/search-history/');
});

export default searchHistoryRouter;
