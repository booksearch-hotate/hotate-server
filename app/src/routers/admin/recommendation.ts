import {Request, Response, Router} from 'express';
import {IPage} from '../datas/IPage';
import csurf from 'csurf';

import Logger from '../../infrastructure/logger/logger';

import RecommendationApplicationService from '../../application/recommendationApplicationService';
import RecommendationRepository from '../../interface/repository/recommendationRepository';
import RecommendationService from '../../domain/service/recommendationService';

import BookApplicationService from '../../application/bookApplicationService';
import BookRepository from '../../interface/repository/bookRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';

import conversionpageCounter from '../../utils/conversionPageCounter';
import getPaginationInfo from '../../utils/getPaginationInfo';
import BookService from '../../domain/service/bookService';

import {IRecommendationObj} from '../../domain/model/recommendation/IRecommendationObj';
import conversionpageStatus from '../../utils/conversionPageStatus';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../../interface/repository/authorRepository';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../../interface/repository/publisherRepository';
import {InvalidDataTypeError} from '../../presentation/error';

// eslint-disable-next-line new-cap
const recommendationRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('recommendation');

const recommendationApplicationService = new RecommendationApplicationService(new RecommendationRepository(db), new RecommendationService());

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

recommendationRouter.get('/', async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const fetchMargin = 10;

  const fetchDatas = await recommendationApplicationService.fetch(pageCount, fetchMargin);

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

  const total = await recommendationApplicationService.fetchAllCount();

  const paginationData = getPaginationInfo(pageCount, total, fetchMargin, 10);

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  pageData.headTitle = 'おすすめセクション一覧';
  pageData.anyData = {
    recommendations,
    paginationData,
  };
  res.render('pages/admin/recommendation/', {pageData});
});

recommendationRouter.get('/edit', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.query.rid;

    if (typeof id !== 'string') throw new InvalidDataTypeError('Invalid value for id');

    const recommendation = await recommendationApplicationService.findById(id);

    /* おすすめセクションに登録されている本の情報を取得 */
    const items = await Promise.all(recommendation.RecommendationItems.map(async (item) => {
      return {
        book: await bookApplicationService.searchBookById(item.BookId),
        comment: item.Comment,
      };
    }));

    const maxSortIndex = await recommendationApplicationService.findMaxIndex();

    pageData.headTitle = 'セクションの編集';
    pageData.anyData = {
      recommendation,
      maxSortIndex,
      items,
    };
    pageData.csrfToken = req.csrfToken();
    res.render('pages/admin/recommendation/edit', {pageData});
  } catch (e: any) {
    logger.error(e);
    res.redirect('/admin/recommendation/');
  }
});

recommendationRouter.post('/udpate', csrfProtection, async (req: Request, res: Response) => {
  try {
    const recommendationId = req.body.id;

    const title = req.body.title;
    const content = req.body.content;
    const formSortIndex = Number(req.body.sortIndex);
    const bookIds = req.body.books === undefined ? [] : req.body.books;
    const bookComments = req.body.bookComments === undefined ? [] : req.body.bookComments;

    let isSolid: boolean;
    switch (req.body.isSolid) {
      case 'solid':
        isSolid = true;
        break;
      case undefined:
        isSolid = false;
        break;
      default:
        throw new InvalidDataTypeError('Invalid optional value; isSolid.');
    }

    const allCount = await recommendationApplicationService.fetchAllCount();

    const sortIndex = allCount - (formSortIndex - 1);

    await recommendationApplicationService.update(recommendationId, title, content, sortIndex, isSolid, bookIds, bookComments);

    req.session.status = {type: 'Success', mes: '投稿の変更に成功しました。'};
    logger.info('Posting is updated.');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '投稿の変更に失敗しました。'};
  } finally {
    res.redirect('/admin/recommendation/');
  }
});

recommendationRouter.get('/add', csrfProtection, (req: Request, res: Response) => {
  pageData.headTitle = 'セクションの追加';
  pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/recommendation/add', {pageData});
});

recommendationRouter.post('/insert', csrfProtection, async (req: Request, res: Response) => {
  try {
    const title = req.body.title;
    const content = req.body.content;

    await recommendationApplicationService.insert(title, content);
    logger.info(`Add new recommendation section. title: ${title}`);
    req.session.status = {type: 'Success', mes: '投稿の追加が完了しました。'};
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '投稿の追加に失敗しました。'};
  } finally {
    res.redirect('/admin/recommendation/');
  }
});

recommendationRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    if (typeof id !== 'string') throw new InvalidDataTypeError('Invalid recommendation section id.');

    await recommendationApplicationService.delete(id);
    logger.info('Posting is deleted.');
    req.session.status = {type: 'Success', mes: '投稿の削除に成功しました。'};
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '投稿の削除に失敗しました。'};
  } finally {
    res.redirect('/admin/recommendation/');
  }
});

export default recommendationRouter;
