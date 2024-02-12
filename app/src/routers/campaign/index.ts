import {Request, Response, Router} from "express";
import csurf from "csurf";

import db from "../../infrastructure/prisma/prisma";
import Logger from "../../infrastructure/logger/logger";
import conversionpageCounter from "../../utils/conversionPageCounter";
import getPaginationInfo from "../../utils/getPaginationInfo";
import RecommendationController from "../../controller/RecommendationController";
import FetchRecommendationThumbnailUseCase from "../../usecase/recommendation/FetchRecommendationThumbnailUsecase";
import RecommendationPrismaRepository from "../../infrastructure/prisma/repository/RecommendationPrismaRepository";
import FindRecommendationUseCase from "../../usecase/recommendation/FindRecommendationUsecase";
import RecommendationFindResponse from "../../presentation/response/recommendation/RecommendationFindResponse";

// eslint-disable-next-line new-cap
const campaignRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("campaign");

const recommendationController = new RecommendationController(
    new FetchRecommendationThumbnailUseCase(
        new RecommendationPrismaRepository(db),
    ),
    new FindRecommendationUseCase(
        new RecommendationPrismaRepository(db),
    ),
);

/* キャンペーン一覧画面 */
campaignRouter.get("/", async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const fetchMargin = 9;

  try {
    const response = await recommendationController.fetchRecommendation(pageCount, fetchMargin);

    if (response.errObj !== null) throw response.error;

    const total = response.count;

    if (total === null) throw new Error("total is null");

    const paginationData = getPaginationInfo(pageCount, total, fetchMargin, 10);

    res.pageData.anyData = {
      recommendations: response.recommendations,
      paginationData,
    };
  } catch (e: any) {
    res.pageData.anyData = {
      recommendations: [],
    };

    req.flash("error", e.message);
  } finally {
    res.pageData.headTitle = "キャンペーン一覧";

    res.render("pages/campaign/index", {pageData: res.pageData});
  }
});

campaignRouter.get("/item/:recommendationId", csrfProtection, async (req: Request, res: Response) => {
  const recommendationId = req.params.recommendationId;

  let recommendation: RecommendationFindResponse | null = null;
  try {
    recommendation = await recommendationController.findRecommendation(recommendationId);

    if (recommendation.recommendation === null) throw new Error("recommendation is null");

    res.pageData.headTitle = recommendation.recommendation.Title;
  } catch (e) {
    logger.warn(`Not found bookId: ${recommendationId}`);
    res.pageData.headTitle = "キャンペーンが見つかりませんでした。";
  }
  res.pageData.anyData = {
    recommendation,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.render("pages/campaign/item", {pageData: res.pageData});
});

export default campaignRouter;
