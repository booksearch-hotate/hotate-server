import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import Logger from '../../infrastructure/logger/logger';

import RecommendationApplicationService from '../../application/recommendationApplicationService';
import RecommendationRepository from '../../interface/repository/recommendationRepository';
import RecommendationService from '../../domain/model/recommendation/recommendationService';

import BookApplicationService from '../../application/bookApplicationService';
import BookRepository from '../../interface/repository/bookRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';

import conversionpageCounter from '../../utils/conversionPageCounter';
import getPaginationInfo from '../../utils/getPaginationInfo';
import BookService from '../../domain/model/book/bookService';

import conversionpageStatus from '../../utils/conversionPageStatus';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../../interface/repository/authorRepository';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../../interface/repository/publisherRepository';
import {InvalidDataTypeError} from '../../presentation/error';
import {defaultThumbnailReg} from '../datas/defaultThumbnailReg';

// eslint-disable-next-line new-cap
const recommendationRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('recommendation');

const recommendationApplicationService = new RecommendationApplicationService(new RecommendationRepository(db), new RecommendationService());

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

recommendationRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const fetchMargin = 9;

  const recommendations = await recommendationApplicationService.fetch(pageCount, fetchMargin);

  const total = await recommendationApplicationService.fetchAllCount();

  const paginationData = getPaginationInfo(pageCount, total, fetchMargin, 10);

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  res.pageData.headTitle = 'おすすめセクション一覧';
  res.pageData.anyData = {
    recommendations,
    paginationData,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/recommendation/', {pageData: res.pageData});
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

    const thumbnailList = recommendationApplicationService.fetchAllthumbnailName();

    const defaultThumbnailList: string[] = [];
    thumbnailList.forEach((thumbnail) => {
      if (new RegExp(defaultThumbnailReg, 'g').test(thumbnail)) {
        defaultThumbnailList.push(thumbnail);
      }
    });

    res.pageData.headTitle = 'セクションの編集';
    res.pageData.anyData = {
      recommendation,
      maxSortIndex,
      items,
      thumbnailList,
      defaultThumbnailList,
    };

    res.pageData.csrfToken = req.csrfToken();

    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render('pages/admin/recommendation/edit', {pageData: res.pageData});
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
    const thumbnailName = req.body.thumbnailName;
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

    await recommendationApplicationService.update(
        recommendationId,
        title,
        content,
        sortIndex,
        thumbnailName,
        isSolid,
        bookIds,
        bookComments,
    );

    req.session.status = {type: 'Success', mes: '投稿の変更に成功しました。'};
    logger.info('Posting is updated.');

    res.redirect('/admin/recommendation/');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '投稿の変更に失敗しました。'};

    res.redirect('/admin/recommendation/edit');
  }
});

recommendationRouter.get('/add', csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = 'セクションの追加';
  const thumbnailList = recommendationApplicationService.fetchAllthumbnailName();

  const defaultThumbnailList: string[] = [];
  thumbnailList.forEach((thumbnail) => {
    if (new RegExp(defaultThumbnailReg, 'g').test(thumbnail)) {
      defaultThumbnailList.push(thumbnail);
    }
  });
  res.pageData.anyData = {
    thumbnailList,
    defaultThumbnailList,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/admin/recommendation/add', {pageData: res.pageData});
});

recommendationRouter.post('/insert', csrfProtection, async (req: Request, res: Response) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const thumbnailName = req.body.thumbnailName;

    await recommendationApplicationService.insert(title, content, thumbnailName);
    logger.info(`Add new recommendation section. title: ${title}`);
    req.session.status = {type: 'Success', mes: '投稿の追加が完了しました。'};

    res.redirect('/admin/recommendation/');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '投稿の追加に失敗しました。'};

    res.redirect('/admin/recommendation/add');
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
