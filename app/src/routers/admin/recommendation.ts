import {Request, Response, Router} from 'express';
import {IPage} from './../datas/IPage';
import csurf from 'csurf';

import Logger from '../../infrastructure/logger/logger';

import RecommendationApplicationService from '../../application/recommendationApplicationService';
import RecommendationRepository from '../../interface/repository/recommendationRepository';
import RecommendationService from '../../domain/service/recommendationService';

import db from '../../infrastructure/db';

// eslint-disable-next-line new-cap
const recommendationRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('recommendation');

const recommendationApplicationService = new RecommendationApplicationService(new RecommendationRepository(db), new RecommendationService());

recommendationRouter.get('/', (req: Request, res: Response) => {
  pageData.headTitle = 'おすすめセクション一覧';

  res.render('pages/admin/recommendation/', {pageData});
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
  } catch (e: any) {
    logger.error(e);
  } finally {
    res.redirect('/admin/recommendation/');
  }
});

export default recommendationRouter;
