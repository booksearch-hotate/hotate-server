import {Request, Response, Router} from "express";
import csurf from "csurf";

import AuthorService from "../../domain/service/authorService";
import PublisherService from "../../domain/service/publisherService";


import db from "../../infrastructure/prisma/prisma";
import EsSearchBook from "../../infrastructure/elasticsearch/esBook";
import EsAuthor from "../../infrastructure/elasticsearch/esAuthor";
import EsPublisher from "../../infrastructure/elasticsearch/esPublisher";
import Logger from "../../infrastructure/logger/logger";

import getPaginationInfo from "../../utils/getPaginationInfo";
import conversionpageCounter from "../../utils/conversionPageCounter";
import isSameLenAllArray from "../../utils/isSameLenAllArray";
import conversionpageStatus from "../../utils/conversionPageStatus";
import {InvalidDataTypeError} from "../../presentation/error";
import BookAdminController from "../../controller/admin/BookController";
import UpdateBookUsecase from "../../usecase/book/UpdateBookUsecase";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import BookESRepository from "../../infrastructure/elasticsearch/repository/BookESRepository";
import AuthorPrismaRepository from "../../infrastructure/prisma/repository/AuthorPrismaRepository";
import PublisherPrismaRepository from "../../infrastructure/prisma/repository/publisherPrismaRepository";
import UpdateAuthorUsecase from "../../usecase/author/UpdateAuthorUsecase";
import AuthorESRepository from "../../infrastructure/elasticsearch/repository/AuthorESRepository";
import UpdatePublisherUsecase from "../../usecase/publisher/UpdatePublisherUsecase";
import PublisherESRepository from "../../infrastructure/elasticsearch/repository/PublisherESRepository";
import SaveBookUseCase from "../../usecase/book/SaveBookUsecase";
import SaveAuthorUseCase from "../../usecase/author/SaveAuthorUsecase";
import SavePublisherUseCase from "../../usecase/publisher/SavePublisherUsecase";
import DeleteBookUseCase from "../../usecase/book/DeleteBookUsecase";
import DeleteAllBookUseCase from "../../usecase/book/DeleteAllBookUsecase";
import FetchAllBookUseCase from "../../usecase/book/FetchAllBookUsecase";
import FetchBookUsecase from "../../usecase/book/FetchBookUsecase";
import DeleteNotUsedAuthorUseCase from "../../usecase/author/DeleteNotUsedAuthorUsecase";
import DeleteNotUsedPublisherUseCase from "../../usecase/publisher/DeleteNotUsedPublisherUsecase";

// eslint-disable-next-line new-cap
const bookRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("admin-book");

const bookAdminController = new BookAdminController(
    new FetchAllBookUseCase(
        new BookPrismaRepository(db),
    ),
    new FetchBookUsecase(
        new BookPrismaRepository(db),
    ),
    new UpdateBookUsecase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
        new AuthorPrismaRepository(db),
        new PublisherPrismaRepository(db),
    ),
    new UpdateAuthorUsecase(
        new AuthorPrismaRepository(db),
        new AuthorESRepository(new EsAuthor("authors")),
        new AuthorService(new AuthorPrismaRepository(db)),
    ),
    new UpdatePublisherUsecase(
        new PublisherPrismaRepository(db),
        new PublisherESRepository(new EsPublisher("publishers")),
        new PublisherService(new PublisherPrismaRepository(db)),
    ),
    new DeleteNotUsedAuthorUseCase(
        new AuthorPrismaRepository(db),
        new AuthorESRepository(new EsAuthor("authors")),
    ),
    new DeleteNotUsedPublisherUseCase(
        new PublisherPrismaRepository(db),
        new PublisherESRepository(new EsPublisher("publishers")),
    ),
    new SaveBookUseCase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
        new AuthorPrismaRepository(db),
        new PublisherPrismaRepository(db),
    ),
    new SaveAuthorUseCase(
        new AuthorPrismaRepository(db),
        new AuthorESRepository(new EsAuthor("authors")),
        new AuthorService(new AuthorPrismaRepository(db)),
    ),
    new SavePublisherUseCase(
        new PublisherPrismaRepository(db),
        new PublisherESRepository(new EsPublisher("publishers")),
        new PublisherService(new PublisherPrismaRepository(db)),
    ),
    new DeleteBookUseCase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
    ),
    new DeleteAllBookUseCase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
    ),
);

bookRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const FETCH_MARGIN = 10; // 一度に取得する本の個数

  const output = await bookAdminController.fetchBooks(pageCount, FETCH_MARGIN);

  const books = output.books;

  const total = output.count;

  if (total === null) throw new Error("Failed to get the total number of books.");

  const paginationData = getPaginationInfo(pageCount, total, FETCH_MARGIN, 10);

  res.pageData.headTitle = "本の管理";
  res.pageData.anyData = {
    books,
    paginationData,
    bookCount: total,
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.pageData.csrfToken = req.csrfToken();

  res.render("pages/admin/book/", {pageData: res.pageData});
});

/* 本の編集画面 */
bookRouter.get("/edit", csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== "string") return res.redirect("/admin/book");

  const book = await bookAdminController.editBookHome(id);

  res.pageData.headTitle = "本編集";
  res.pageData.anyData = {book};
  res.pageData.csrfToken = req.csrfToken();
  return res.render("pages/admin/book/edit", {pageData: res.pageData});
});

/* 本の更新処理 */
bookRouter.post("/update", csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookId = req.body.id;

    if (typeof bookId !== "string") throw new InvalidDataTypeError("Invalid request id.");

    await bookAdminController.updateBook(
        bookId,
        req.body.bookName,
        req.body.bookSubName,
        req.body.bookContent,
        req.body.isbn,
        req.body.ndc,
        req.body.year,
        req.body.authorName,
        req.body.publisherName,
    );

    req.session.status = {type: "Success", mes: "本の更新が完了しました"};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: "Failure", error: e, mes: "本の更新に失敗しました"};
  } finally {
    res.redirect("/admin/book");
  }
});

/* 本の追加画面 */
bookRouter.get("/add", csrfProtection, (req: Request, res: Response) => {
  res.pageData.headTitle = "本の追加";

  res.pageData.csrfToken = req.csrfToken();
  res.render("pages/admin/book/add", {pageData: res.pageData});
});

/* 本の追加処理 */
bookRouter.post("/add", csrfProtection, async (req: Request, res: Response) => {
  try {
    const isSameLen = isSameLenAllArray([
      req.body.bookName,
      req.body.bookSubName,
      req.body.content,
      req.body.isbn,
      req.body.ndc,
      req.body.year,
      req.body.authorName,
      req.body.publisherName,
    ]);

    if (!isSameLen) throw new InvalidDataTypeError("データの長さが一致しません。");

    const data: {
      bookName: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      authorName: string,
      publisherName: string,
    }[] = (req.body.bookName as string[]).map((_, i) => {
      return {
        bookName: req.body.bookName[i],
        subName: req.body.bookSubName[i] === "" ? null : req.body.bookSubName[i],
        content: req.body.content[i] === "" ? null : req.body.content[i],
        isbn: req.body.isbn[i] === "" ? null : req.body.isbn[i],
        ndc: req.body.ndc[i] === "" ? null : parseInt(req.body.ndc[i], 10),
        year: req.body.year[i] === "" ? null : parseInt(req.body.year[i], 10),
        authorName: req.body.authorName[i],
        publisherName: req.body.publisherName[i],
      };
    });

    await bookAdminController.saveBook(data);

    req.session.status = {type: "Success", mes: `${req.body.isbn.length}冊の本を追加しました`};
  } catch (e: any) {
    logger.error(e.message as string);
    req.session.status = {type: "Failure", error: e, mes: "本の追加中にエラーが発生しました"};
  } finally {
    res.redirect("/admin/book");
  }
});

/* 本の削除機能 */
bookRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    if (typeof id !== "string") throw new InvalidDataTypeError("Invalid request id");

    await bookAdminController.deleteBook(id);

    req.session.status = {type: "Success", mes: "本の削除が完了しました"};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: "Failure", error: e, mes: "本の削除に失敗しました"};
  } finally {
    res.redirect("/admin/book");
  }
});

/* 本を全て削除 */
bookRouter.post("/delete-all", csrfProtection, async (req: Request, res: Response) => {
  try {
    await bookAdminController.deleteAll();

    req.session.status = {type: "Success", mes: "本の全削除に成功しました。"};
    logger.info("Succeeded in deleting all the books.");
  } catch (e: any) {
    req.session.status = {type: "Failure", error: e, mes: "本の全削除に失敗しました。"};
    logger.error(e as string);
    logger.error("Failed to delete all books.");
  } finally {
    res.redirect("/admin/book");
  }
});

export default bookRouter;
