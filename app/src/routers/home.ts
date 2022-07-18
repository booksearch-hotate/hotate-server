import {Request, Response, Router} from 'express';

import RecommendationApplicationService from '../application/recommendationApplicationService';
import RecommendationService from '../domain/service/recommendationService';
import db from '../infrastructure/db';
import RecommendationRepository from '../interface/repository/recommendationRepository';

import Logger from '../infrastructure/logger/logger';

import {IPage} from './datas/IPage';
import BookApplicationService from '../application/bookApplicationService';
import BookRepository from '../interface/repository/bookRepository';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import BookService from '../domain/service/bookService';
import csurf from 'csurf';

// eslint-disable-next-line new-cap
const homeRouter = Router();

const pageData: IPage = {} as IPage;

const logger = new Logger('home');

const csrfProtection = csurf({cookie: false});

const recommendationApplicationService = new RecommendationApplicationService(
    new RecommendationRepository(db),
    new RecommendationService(),
);

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

homeRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  try {
    const fetchDatas = recommendationApplicationService.omitContent(await recommendationApplicationService.fetch(0, 5));

    const recommendations = await Promise.all(fetchDatas.map(async (recommendation) => {
      const books = await Promise.all(recommendation.BookIds.map(async (bookId) => await bookApplicationService.searchBookById(bookId)));
      return {recommendation, books};
    }));

    pageData.anyData = {
      recommendations,
    };
    pageData.csrfToken = req.csrfToken();
  } catch (e: any) {
    logger.error(e);
  } finally {
    pageData.headTitle = 'ホーム | HOTATE';

    res.render('pages/index', {pageData});
  }
});

export default homeRouter;
