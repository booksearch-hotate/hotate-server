import {Request, Response, Router} from "express";
import csurf from "csurf";

import Logger from "../../infrastructure/logger/logger";

import conversionpageCounter from "../../utils/conversionPageCounter";
import getPaginationInfo from "../../utils/getPaginationInfo";

import conversionpageStatus from "../../utils/conversionPageStatus";
import {InvalidDataTypeError} from "../../presentation/error";
import RecommendationAdminController from "../../controller/admin/RecommendationController";
import FetchRecommendationThumbnailUseCase from "../../usecase/recommendation/FetchRecommendationThumbnailUsecase";
import RecommendationPrismaRepository from "../../infrastructure/prisma/repository/RecommendationPrismaRepository";
import FindRecommendationUseCase from "../../usecase/recommendation/FindRecommendationUsecase";
import FetchMaxIndexRecommendationUseCase from "../../usecase/recommendation/FetchMaxIndexRecommendationUsecase";
import db from "../../infrastructure/prisma/prisma";
import FetchThumbnailNamesUseCase from "../../usecase/thumbnail/FetchThumbnailNamesUsecase";
import UpdateRecommendationUseCase from "../../usecase/recommendation/UpdateRecommendationUsecase";
import InsertRecommendationUseCase from "../../usecase/recommendation/InsertRecommendationUsecase";
import ThumbnailFileRepository from "../../infrastructure/fileAccessor/thumbnail/repository/ThumbnailFileRepositoy";
import ThumbnailFileAccessor from "../../infrastructure/fileAccessor/thumbnail/thumbnailFile";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import DeleteRecommendationUsecase from "../../usecase/recommendation/DeleteRecommendationUsecase";

// eslint-disable-next-line new-cap
const recommendationRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("recommendation");

const recommendationController = new RecommendationAdminController(
    new FetchRecommendationThumbnailUseCase(
        new RecommendationPrismaRepository(db),
    ),
    new FindRecommendationUseCase(
        new RecommendationPrismaRepository(db),
    ),
    new FetchMaxIndexRecommendationUseCase(
        new RecommendationPrismaRepository(db),
    ),
    new FetchThumbnailNamesUseCase(
        new ThumbnailFileRepository(new ThumbnailFileAccessor()),
    ),
    new UpdateRecommendationUseCase(
        new RecommendationPrismaRepository(db),
        new BookPrismaRepository(db),
    ),
    new InsertRecommendationUseCase(
        new RecommendationPrismaRepository(db),
    ),
    new DeleteRecommendationUsecase(
        new RecommendationPrismaRepository(db),
    ),
);

recommendationRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  const FETCH_MARGIN = 9;

  const pageCount = conversionpageCounter(req);

  const output = await recommendationController.index(pageCount, FETCH_MARGIN);

  const recommendations = output.recommendations;

  const total = output.count;

  if (total === null) throw new Error("Total count is null.");

  const paginationData = getPaginationInfo(pageCount, total, FETCH_MARGIN, 10);

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  res.pageData.headTitle = "おすすめセクション一覧";
  res.pageData.anyData = {
    recommendations,
    paginationData,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.render("pages/admin/recommendation/", {pageData: res.pageData});
});

recommendationRouter.get("/edit", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.query.rid;

    if (typeof id !== "string") throw new InvalidDataTypeError("Invalid value for id");

    const output = await recommendationController.detail(id);

    res.pageData.headTitle = "セクションの編集";
    res.pageData.anyData = {
      recommendation: output.recommendation,
      maxSortIndex: output.maxIndex,
      items: output.recommendation?.RecommendationItems,
      thumbnailList: output.thumbnailNames,
      defaultThumbnailList: output.defaultThumbnailNames,
    };

    res.pageData.csrfToken = req.csrfToken();

    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render("pages/admin/recommendation/edit", {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    res.redirect("/admin/recommendation/");
  }
});

recommendationRouter.post("/udpate", csrfProtection, async (req: Request, res: Response) => {
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
      case "solid":
        isSolid = true;
        break;
      case undefined:
        isSolid = false;
        break;
      default:
        throw new InvalidDataTypeError("Invalid optional value; isSolid.");
    }

    await recommendationController.update(
        recommendationId,
        title,
        content,
        thumbnailName,
        isSolid,
        formSortIndex,
        bookIds,
        bookComments,
    );

    req.session.status = {type: "Success", mes: "投稿の変更に成功しました。"};
    logger.info("Posting is updated.");

    res.redirect("/admin/recommendation/");
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "投稿の変更に失敗しました。"};

    res.redirect("/admin/recommendation/edit");
  }
});

recommendationRouter.get("/add", csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = "セクションの追加";
  const output = recommendationController.add();

  res.pageData.anyData = {
    thumbnailList: output.thumbnailNameList,
    defaultThumbnailList: output.defaultTypeList,
  };

  res.pageData.csrfToken = req.csrfToken();

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render("pages/admin/recommendation/add", {pageData: res.pageData});
});

recommendationRouter.post("/insert", csrfProtection, async (req: Request, res: Response) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const thumbnailName = req.body.thumbnailName;

    const output = await recommendationController.insert(title, content, thumbnailName);

    if (output.errObj !== null) throw output.errObj.err;

    logger.info(`Add new recommendation section. title: ${title}`);
    req.session.status = {type: "Success", mes: "投稿の追加が完了しました。"};

    res.redirect("/admin/recommendation/");
  } catch (e: any) {
    req.flash("error", e.message);

    res.redirect("/admin/recommendation/add");
  }
});

recommendationRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    if (typeof id !== "string") throw new InvalidDataTypeError("Invalid recommendation section id.");

    await recommendationController.delete(id);

    logger.info("Posting is deleted.");
    req.session.status = {type: "Success", mes: "投稿の削除に成功しました。"};
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "投稿の削除に失敗しました。"};
  } finally {
    res.redirect("/admin/recommendation/");
  }
});

export default recommendationRouter;
