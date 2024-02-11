import csurf from "csurf";
import {Router, Request, Response} from "express";
import BookController from "../../controller/BookController";
import EsAuthor from "../../infrastructure/elasticsearch/esAuthor";
import EsSearchBook from "../../infrastructure/elasticsearch/esBook";
import EsPublisher from "../../infrastructure/elasticsearch/esPublisher";
import AuthorESRepository from "../../infrastructure/elasticsearch/repository/AuthorESRepository";
import BookESRepository from "../../infrastructure/elasticsearch/repository/BookESRepository";
import PublisherESRepository from "../../infrastructure/elasticsearch/repository/PublisherESRepository";
import db from "../../infrastructure/prisma/prisma";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import FetchBookUsecase from "../../usecase/book/FetchBookUsecase";
import SearchBooksUsecase from "../../usecase/book/SearchBooksUsecase";
import conversionpageStatus from "../../utils/conversionPageStatus";
import Logger from "../../infrastructure/logger/logger";
import FindBookmarkUsecase from "../../usecase/bookmark/FindBookmarkUsecase";
import BookmarkPrismaRepository from "../../infrastructure/prisma/repository/BookmarkPrismaRepository";
import UserPrismaRepository from "../../infrastructure/prisma/repository/UserPrismaRepository";

// eslint-disable-next-line new-cap
const bookItemRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("bookItemRouter");

const bookController = new BookController(
    new FetchBookUsecase(
        new BookPrismaRepository(db),
    ),
    new SearchBooksUsecase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
        new AuthorESRepository(new EsAuthor("authors")),
        new PublisherESRepository(new EsPublisher("publishers")),
    ),
    new FindBookmarkUsecase(
        new BookmarkPrismaRepository(db),
        new UserPrismaRepository(db),
    ),
);

bookItemRouter.get("/item/:bookId", csrfProtection, async (req: Request, res: Response) => {
  const id = req.params.bookId; // 本のID
  const isAdmin = req.user !== undefined && (req.user as {role: "admin" | "user"}).role === "admin";
  try {
    const bookData = await bookController.fetchBook(id);

    if (bookData.book === null) throw new Error("Not found book");

    const isAlreadyBookmarked = req.user !== undefined && (await bookController.isAlreadyBookmark(bookData.book.book.Id, (req.user as {id: number}).id)).isAlready;

    res.pageData.headTitle = `${bookData.book.book.BookName} `;
    res.pageData.anyData = {
      bookData: bookData.book.book,
      isError: false,
      isLogin: isAdmin,
      nearCategoryBookDatas: bookData.nearCategoryBooks?.books,
      recommendation: bookData.book.recommendations,
      isAlreadyBookmarked,
    };

    res.pageData.csrfToken = req.csrfToken();
  } catch {
    logger.warn(`Not found bookId: ${id}`);
    res.pageData.headTitle = "本が見つかりませんでした。";
    res.pageData.anyData = {isError: true};
  } finally {
    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render("pages/item", {pageData: res.pageData});
  }
});

export default bookItemRouter;
