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
import {IRecommendationObj} from '../domain/model/recommendation/IRecommendationObj';
import AuthorRepository from '../interface/repository/authorRepository';
import EsAuthor from '../infrastructure/elasticsearch/esAuthor';
import EsPublisher from '../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../interface/repository/publisherRepository';

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
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

homeRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  try {
    const fetchDatas = recommendationApplicationService.omitContent(await recommendationApplicationService.fetch(0, 5));

    const recommendations: IRecommendationObj[] = await Promise.all(fetchDatas.map(async (recommendation) => {
      const items = await Promise.all(recommendation.RecommendationItems.map(async (item) => {
        return {
          book: await bookApplicationService.searchBookById(item.BookId),
          comment: item.Comment,
        };
      }));
      const item: IRecommendationObj = {recommendation, items};

      return item;
    }));

    pageData.anyData = {
      recommendations: recommendations === undefined ? [] : recommendations,
    };
    pageData.csrfToken = req.csrfToken();
  } catch (e: any) {
    logger.error(e);
    pageData.anyData = {
      recommendations: [],
    };
  } finally {
    pageData.headTitle = 'ホーム | HOTATE';

    res.render('pages/index', {pageData});
  }
});

export default homeRouter;
