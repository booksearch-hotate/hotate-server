import {Request, Response, Router} from "express";
import csurf from "csurf";

import {FormInvalidError, NullDataError} from "../presentation/error";

import db from "../infrastructure/prisma/prisma";
import Logger from "../infrastructure/logger/logger";

import conversionpageStatus from "../utils/conversionPageStatus";
import RequestIndexController from "../controller/RequestIndexController";
import SetRequestUseCase from "../usecase/request/SetRequestUsecase";
import SchoolGradeInfoPrismaRepository from "../infrastructure/prisma/repository/SchoolGradeInfoPrismaRepository";
import DepartmentPrismaRepository from "../infrastructure/prisma/repository/DepartmentPrismaRepository";
import MakeRequestDataUsecase from "../usecase/request/MakeRequestDataUsecase";
import SaveRequestUsecase from "../usecase/request/SaveRequestUsecase";
import BookRequestPrismaRepository from "../infrastructure/prisma/repository/BookRequestPrismaRepository";

// eslint-disable-next-line new-cap
const requestRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("bookRequest");

const requestIndexController = new RequestIndexController(
    new SetRequestUseCase(
        new SchoolGradeInfoPrismaRepository(db),
        new DepartmentPrismaRepository(db),
    ),
    new MakeRequestDataUsecase(
        new DepartmentPrismaRepository(db),
    ),
    new SaveRequestUsecase(
        new BookRequestPrismaRepository(db),
    ),
);

/*
本のリクエスト入力を行う画面
*/
requestRouter.get("/request", csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = "本のリクエスト ";

  const keepReqObj = typeof req.session.keepValue === "object" ? req.session.keepValue.keepReqObj : {};

  const output = await requestIndexController.setRequest();

  if (output.departmentList.length === 0) {
    logger.warn("学科情報が登録されていないため、リクエスト機能を利用することができません。");

    req.flash("warning", "現在本リクエスト機能は使用できません。");
    return res.redirect("/");
  }

  res.pageData.anyData = {
    departmentList: output.departmentList,
    saveVal: keepReqObj,
    schoolGradeInfo: output.schoolGradeInfo,
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.pageData.csrfToken = req.csrfToken();

  return res.render("pages/request", {pageData: res.pageData});
});

/*
入力内容をsessionに格納するためにPOSTルーティング。/confirm-requestにリダイレクトする
 */
requestRouter.post("/confirm", csrfProtection, async (req: Request, res: Response) => {
  const bookName = req.body.bookName;
  const authorName = req.body.authorName;
  const publisherName = req.body.publisherName;
  const isbn = req.body.isbn;
  const message = req.body.message;

  const departmentId = req.body.department;
  const schoolYear = req.body.schoolYear;
  const schoolClass = req.body.class;
  const userName = req.body.userName;

  const keepReqObj = {
    bookName,
    authorName,
    publisherName,
    isbn,
    message,
    departmentId,
    schoolYear,
    schoolClass,
    userName,
  };

  req.session.keepValue = {keepReqObj};
  return res.redirect("/confirm-request");
});

/*
入力内容を確認する画面
*/
requestRouter.get("/confirm-request", csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = "リクエスト内容の確認 ";

  res.pageData.csrfToken = req.csrfToken();

  try {
    const data = req.session.keepValue as {
      keepReqObj: {
        bookName: string;
        authorName: string;
        publisherName: string;
        isbn: string;
        message: string;
        departmentId: string;
        schoolYear: string;
        schoolClass: string;
        userName: string;
      };
    };

    if (typeof data === "undefined") throw new NullDataError("The request data could not be obtained.");

    const reqData = await requestIndexController.makeData(
        data.keepReqObj.bookName,
        data.keepReqObj.authorName,
        data.keepReqObj.publisherName,
        data.keepReqObj.isbn,
        data.keepReqObj.message,
        data.keepReqObj.departmentId,
        Number(data.keepReqObj.schoolYear),
        Number(data.keepReqObj.schoolClass),
        data.keepReqObj.userName,
    );

    if (reqData === null) throw new NullDataError("The request data could not be obtained.");

    res.pageData.anyData = {request: reqData.data};

    return res.render("pages/confirm-request", {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);

    if (e instanceof FormInvalidError) {
      req.session.status = {type: "Failure", error: e, mes: "フォームの入力が間違っています。もう一度お試しください。"};
      return res.redirect("/request");
    }

    req.session.status = {type: "Failure", error: e, mes: "リクエスト内容の取得に失敗しました。"};
    return res.redirect("/");
  }
});

requestRouter.post("/register", csrfProtection, async (req: Request, res: Response) => {
  try {
    const data = req.session.keepValue as {
      keepReqObj: {
        bookName: string;
        authorName: string;
        publisherName: string;
        isbn: string;
        message: string;
        departmentId: string;
        schoolYear: string;
        schoolClass: string;
        userName: string;
      };
    };

    if (typeof data === "undefined") throw new NullDataError("The request data could not be obtained.");

    const reqData = await requestIndexController.makeData(
        data.keepReqObj.bookName,
        data.keepReqObj.authorName,
        data.keepReqObj.publisherName,
        data.keepReqObj.isbn,
        data.keepReqObj.message,
        data.keepReqObj.departmentId,
        Number(data.keepReqObj.schoolYear),
        Number(data.keepReqObj.schoolClass),
        data.keepReqObj.userName,
    );

    if (reqData.data === null) throw new NullDataError("The request data could not be obtained.");

    await requestIndexController.save(reqData.data);


    logger.info(`Request received. Sender Name: ${data.keepReqObj.userName}`);

    res.redirect("/thanks-request");
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "リクエストの記録に失敗しました"};
    res.redirect("/request");
  }
});

requestRouter.get("/thanks-request", (req: Request, res: Response) => {
  if (typeof req.session.keepValue === "undefined") return res.redirect("/");

  req.session.keepValue = undefined;

  res.pageData.headTitle = "リクエスト完了 ";

  return res.render("pages/thanks-request", {pageData: res.pageData});
});

export default requestRouter;
