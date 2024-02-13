import {Request, Response, Router} from "express";
import csurf from "csurf";
import multer from "multer";
import {broadcast} from "../../handler/ws";

import AuthorService from "../../domain/service/authorService";
import PublisherService from "../../domain/service/publisherService";

import db from "../../infrastructure/prisma/prisma";
import EsSearchBook from "../../infrastructure/elasticsearch/esBook";
import CsvFile from "../../infrastructure/fileAccessor/csv/csvFile";
import Logger from "../../infrastructure/logger/logger";
import EsAuthor from "../../infrastructure/elasticsearch/esAuthor";
import EsPublisher from "../../infrastructure/elasticsearch/esPublisher";

import {DomainInvalidError} from "../../presentation/error";
import CsvController from "../../controller/admin/CsvController";
import SaveManyAuthorsUsecase from "../../usecase/author/SaveManyAuthorsUsecase";
import AuthorPrismaRepository from "../../infrastructure/prisma/repository/AuthorPrismaRepository";
import AuthorESRepository from "../../infrastructure/elasticsearch/repository/AuthorESRepository";
import SaveManyPublisherUsecase from "../../usecase/publisher/SaveManyPublisherUsecase";
import PublisherPrismaRepository from "../../infrastructure/prisma/repository/publisherPrismaRepository";
import SaveManyBooksUsecase from "../../usecase/book/SaveManyBooksUsecase";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import BookESRepository from "../../infrastructure/elasticsearch/repository/BookESRepository";
import PublisherESRepository from "../../infrastructure/elasticsearch/repository/PublisherESRepository";


// eslint-disable-next-line new-cap
const csvRouter = Router();

const csvFile = new CsvFile();

const upload = multer({dest: "./uploads/csv/"}); // multerの設定

const csrfProtection = csurf({cookie: false});

const logger = new Logger("csv");

const csvController = new CsvController(
    new SaveManyAuthorsUsecase(
        new AuthorPrismaRepository(db),
        new AuthorESRepository(new EsAuthor("authors")),
        new AuthorService(new AuthorPrismaRepository(db)),
    ),
    new SaveManyPublisherUsecase(
        new PublisherPrismaRepository(db),
        new PublisherESRepository(new EsPublisher("publishers")),
        new PublisherService(new PublisherPrismaRepository(db)),
    ),
    new SaveManyBooksUsecase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
    ),
);

/* csvファイル選択画面 */
csvRouter.get("/choice", csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = "CSVファイル選択";
  res.pageData.csrfToken = req.csrfToken();

  res.render("pages/admin/csv/choice", {pageData: res.pageData});
});

/* csvファイルのヘッダを選択する画面 */
csvRouter.get("/headerChoice", csrfProtection, async (req: Request, res: Response) => {
  try {
    res.pageData.anyData = {csvHeader: await csvFile.getHeaderNames()};
    res.pageData.headTitle = "CSVファイルヘッダー選択";
    res.pageData.csrfToken = req.csrfToken();

    res.render("pages/admin/csv/headerChoice", {pageData: res.pageData});
  } catch (e) {
    res.redirect("/admin/csv/choice");
  }
});

/* ローディング画面 */
csvRouter.get("/loading", (req: Request, res: Response) => {
  if (!csvFile.isExistFile()) return res.redirect("/admin/");

  res.pageData.headTitle = "読み込み中...";

  return res.render("pages/admin/csv/loading", {pageData: res.pageData});
});

/* csvファイルの受け取り */
csvRouter.post("/sendFile", csrfProtection, upload.single("csv"), async (req, res: Response) => {
  const file = req.file;

  try {
    csvFile.File = file;
    csvFile.convertUtf8();
    logger.info("csv file retrieved.");
  } catch (err) {
    logger.error("Failed to retrieve csv file.");
  }

  res.redirect("/admin/csv/headerChoice");
});

/* csvファイルからDBへ登録する作業 */
csvRouter.post("/formHeader", csrfProtection, async (req: Request, res: Response) => {
  try {
    logger.trace("getting csv file.");
    const csv: any[] = await csvFile.getFileContent(); // csvファイルの内容を取得
    if (csvFile.File !== undefined) res.redirect("/admin/csv/loading");
    else res.redirect("/admin/csv/choice");

    broadcast({
      progress: "init",
      data: {
        current: -1,
        total: -1,
      },
    });

    logger.trace("start to input books data.");

    const startTimer = performance.now();

    const csvLength = csv.length;

    const data: {
      bookName: string;
      subName: string;
      content: string;
      isbn: string;
      ndc: string;
      year: string;
      authorName: string;
      publisherName: string;
    }[] = csv.map((row) => {
      return {
        bookName: row[req.body.bookName] as string,
        subName: row[req.body.bookSubName] as string,
        content: row[req.body.bookContent] as string,
        isbn: row[req.body.isbn] as string,
        ndc: row[req.body.ndc] as string,
        year: row[req.body.year] as string,
        authorName: row[req.body.authorName] as string,
        publisherName: row[req.body.publisherName] as string,
      };
    });

    await csvController.saveByCsvData(data);

    logger.trace("starting send bulk api.");

    broadcast({
      progress: "progress",
      data: {
        current: csvLength,
        total: csvLength,
      },
    });

    // 完了したことをwsで飛ばす
    broadcast({
      progress: "complete",
      data: {
        current: csvLength,
        total: csvLength,
      },
    });
    const endTimer = performance.now();

    logger.trace(`It took ${endTimer - startTimer}ms to register the csv file.`);
  } catch (e) {
    if (e instanceof DomainInvalidError) logger.error(e.message);
    else logger.error(e as string);

    broadcast({
      progress: "error",
      data: {
        current: 0,
        total: 0,
      },
    });
  } finally {
    csvFile.deleteFiles(); // csvファイルを削除
  }
});

export default csvRouter;
