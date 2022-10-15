import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import RecommendationApplicationService from '../application/recommendationApplicationService';
import RecommendationRepository from '../interface/repository/recommendationRepository';
import db from '../infrastructure/db';
import RecommendationService from '../domain/service/recommendationService';
// import Logger from '../infrastructure/logger/logger';
import conversionpageCounter from '../utils/conversionPageCounter';
import getPaginationInfo from '../utils/getPaginationInfo';

// eslint-disable-next-line new-cap
const campaignRouter = Router();

const csrfProtection = csurf({cookie: false});

// const logger = new Logger('campaign');

const recommendationApplicationService = new RecommendationApplicationService(
    new RecommendationRepository(db),
    new RecommendationService(),
);

/* 本詳細画面 */
campaignRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
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

export default campaignRouter;
