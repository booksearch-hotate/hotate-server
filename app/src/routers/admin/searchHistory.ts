import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import SearchHistoryService from '../../domain/service/searchHistoryService';

import SearchHistoryApplicationService from '../../application/SearchHistoryApplicationService';

import SearchHistoryRepository from '../../interface/repository/SearchHistoryRepository';


import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';

import {IPage} from '../datas/IPage';
import {IPaginationData} from '../datas/IPaginationData';

import getPaginationInfo from '../../modules/getPaginationInfo';

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
  let pageCount = Number(req.query.page as string);
  if (isNaN(pageCount)) pageCount = 0;
  else pageCount--;

  if (pageCount <= 0) pageCount = 0;

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
  res.render('pages/admin/search_history/index', {pageData});
});

/* 検索履歴削除 */
searchHistoryRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    await searchHistoryApplicationService.delete(id);
  } catch (e) {
  }

  res.redirect('/admin/search_history/');
});

export default searchHistoryRouter;
