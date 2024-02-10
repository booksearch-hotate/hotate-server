import {Request, Response, Router} from "express";

import db from "../infrastructure/prisma/prisma";

import Logger from "../infrastructure/logger/logger";
import csurf from "csurf";
import conversionpageStatus from "../utils/conversionPageStatus";
import HomeController from "../controller/HomeController";
import FetchRecommendationThumbnailUseCase from "../usecase/recommendation/FetchRecommendationThumbnailUsecase";
import RecommendationPrismaRepository from "../infrastructure/prisma/repository/RecommendationPrismaRepository";

// eslint-disable-next-line new-cap
const homeRouter = Router();

const logger = new Logger("home");

const csrfProtection = csurf({cookie: false});

const homeController = new HomeController(
    new FetchRecommendationThumbnailUseCase(
        new RecommendationPrismaRepository(db),
    ),
);

homeRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  try {
    const response = await homeController.fetchRecommendation();
    res.pageData.anyData = {
      recommendations: response.recommendations,
    };
  } catch (e: any) {
    logger.error(e);
    res.pageData.anyData = {
      recommendations: [],
    };
  } finally {
    res.pageData.csrfToken = req.csrfToken();

    res.pageData.headTitle = "ホーム";

    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render("pages/index", {pageData: res.pageData});
  }
});

export default homeRouter;
