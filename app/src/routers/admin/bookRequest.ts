import {Request, Response, Router} from "express";
import csurf from "csurf";

import Logger from "../../infrastructure/logger/logger";
import db from "../../infrastructure/prisma/prisma";

import conversionpageStatus from "../../utils/conversionPageStatus";
import {InvalidDataTypeError, NullDataError} from "../../presentation/error";
import BookRequestAdminController from "../../controller/admin/BookRequestController";
import FetchAllRequestUseCase from "../../usecase/request/FetchAllRequestUsecase";
import BookRequestPrismaRepository from "../../infrastructure/prisma/repository/BookRequestPrismaRepository";
import FindRequestUseCase from "../../usecase/request/FindRequestUsecase";
import DeleteRequestUseCase from "../../usecase/request/DeleteRequestUsecase";

// eslint-disable-next-line new-cap
const bookRequestRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("department");

const requestController = new BookRequestAdminController(
    new FetchAllRequestUseCase(
        new BookRequestPrismaRepository(db),
    ),
    new FindRequestUseCase(
        new BookRequestPrismaRepository(db),
    ),
    new DeleteRequestUseCase(
        new BookRequestPrismaRepository(db),
    ),
);

bookRequestRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  const requests = await requestController.fetchAll();

  res.pageData.headTitle = "本のリクエスト画面の詳細 ";
  res.pageData.csrfToken = req.csrfToken();
  res.pageData.anyData = {requests: requests.requests};

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render("pages/admin/book-request/index", {pageData: res.pageData});
});

bookRequestRouter.get("/detail", async (req: Request, res: Response) => {
  try {
    const requestId = req.query.id;

    if (typeof requestId !== "string") throw new InvalidDataTypeError("Failed to get id.");

    const requestData = await requestController.findById(requestId);

    if (requestData === null) throw new NullDataError("Request data did not exist.");

    res.pageData.headTitle = "本リクエストの詳細 ";
    res.pageData.anyData = {request: requestData.request};

    res.render("pages/admin/book-request/detail", {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "リクエスト情報の取得に失敗しました"};
    res.redirect("/admin/book-request/");
  }
});

bookRequestRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.deleteId;

    await requestController.delete(id);
    req.session.status = {type: "Success", mes: "削除に成功しました。"};
    logger.info(`Request is deleted. id : ${id}`);
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "削除に失敗しました。"};
  } finally {
    res.redirect("/admin/book-request/");
  }
});

export default bookRequestRouter;
