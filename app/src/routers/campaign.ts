import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import RecommendationApplicationService from '../application/recommendationApplicationService';
import RecommendationRepository from '../interface/repository/recommendationRepository';
import db from '../infrastructure/db';
import RecommendationService from '../domain/model/recommendation/recommendationService';
import Logger from '../infrastructure/logger/logger';
import conversionpageCounter from '../utils/conversionPageCounter';
import getPaginationInfo from '../utils/getPaginationInfo';
import BookApplicationService from '../application/bookApplicationService';
import BookRepository from '../interface/repository/bookRepository';
import BookService from '../domain/model/book/bookService';
import EsAuthor from '../infrastructure/elasticsearch/esAuthor';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import EsPublisher from '../infrastructure/elasticsearch/esPublisher';
import AuthorRepository from '../interface/repository/authorRepository';
import PublisherRepository from '../interface/repository/publisherRepository';
import {IRecommendationObj} from '../domain/model/recommendation/IRecommendationObj';

// eslint-disable-next-line new-cap
const campaignRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('campaign');

const recommendationApplicationService = new RecommendationApplicationService(
    new RecommendationRepository(db),
    new RecommendationService(),
);

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

/* キャンペーン一覧画面 */
campaignRouter.get('/', async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const fetchMargin = 9;

  const recommendations = await recommendationApplicationService.fetch(pageCount, fetchMargin);

  const total = await recommendationApplicationService.fetchAllCount();

  const paginationData = getPaginationInfo(pageCount, total, fetchMargin, 10);

  res.pageData.anyData = {
    recommendations,
    paginationData,
  };

  res.pageData.headTitle = 'キャンペーン一覧';

  res.render('pages/campaign/index', {pageData: res.pageData});
});

campaignRouter.get('/item/:recommendationId', csrfProtection, async (req: Request, res: Response) => {
  const recommendationId = req.params.recommendationId;

  let recommendation: IRecommendationObj | null = null;
  try {
    const recommendationItem = await recommendationApplicationService.findById(recommendationId);

    const recommendationBooks = await Promise.all(recommendationItem.RecommendationItems.map(async (item) => {
      const book = await bookApplicationService.searchBookById(item.BookId);

      return {book, comment: item.Comment};
    }));

    recommendation = {recommendation: recommendationItem, items: recommendationBooks};

    res.pageData.headTitle = recommendationItem.Title;
  } catch (e) {
    logger.warn(`Not found bookId: ${recommendationId}`);
    res.pageData.headTitle = 'キャンペーンが見つかりませんでした。';
  }
  res.pageData.anyData = {
    recommendation,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/campaign/item', {pageData: res.pageData});
});

export default campaignRouter;
