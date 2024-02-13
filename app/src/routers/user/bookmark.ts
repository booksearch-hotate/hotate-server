import {NextFunction, Router, Request, Response} from "express";
import db from "../../infrastructure/prisma/prisma";
import Logger from "../../infrastructure/logger/logger";
import csurf from "csurf";
import BookmarkController from "../../controller/BookmarkController";
import AddBookmarkUseCase from "../../usecase/bookmark/AddBookmarkUsecase";
import BookmarkPrismaRepository from "../../infrastructure/prisma/repository/BookmarkPrismaRepository";
import UserPrismaRepository from "../../infrastructure/prisma/repository/UserPrismaRepository";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import FindBookmarkUsecase from "../../usecase/bookmark/FindBookmarkUsecase";
import RemoveBookmarkUseCase from "../../usecase/bookmark/RemoveBookmarkUsecase";

// eslint-disable-next-line new-cap
const bookMarkRouter = Router();

const bookmarkController = new BookmarkController(
    new AddBookmarkUseCase(
        new BookmarkPrismaRepository(db),
        new UserPrismaRepository(db),
        new BookPrismaRepository(db),
    ),
    new FindBookmarkUsecase(
        new BookmarkPrismaRepository(db),
        new UserPrismaRepository(db),
    ),
    new RemoveBookmarkUseCase(
        new BookmarkPrismaRepository(db),
        new UserPrismaRepository(db),
        new BookPrismaRepository(db),
    ),
);

const csrfProtection = csurf({cookie: false});

const logger = new Logger("bookMarkRouter");

bookMarkRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (!!req.user && req.isAuthenticated()) next();
  else return res.redirect("/user/login");
});

bookMarkRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = "ブックマーク一覧";

  res.pageData.csrfToken = req.csrfToken();

  const userId = (req.user as {id: number}).id;

  res.pageData.anyData = {
    bookmarks: (await bookmarkController.findByUserId(userId)).books,
  };

  res.render("pages/user/bookmark/index", {pageData: res.pageData});
});

bookMarkRouter.post("/insert", csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;

  try {
    if (!req.isAuthenticated()) {
      res.redirect("/user/login");
      return;
    }
    const userId = (req.user as {id: number}).id;

    await bookmarkController.add(userId, bookId);

    req.flash("success", "ブックマークを登録しました");
    return res.redirect(`/item/${bookId}`);
  } catch (e: any) {
    req.flash("error", "ブックマークの登録に失敗しました");
    logger.error(e);
    res.redirect(`/item/${bookId}`);
    return;
  }
});

bookMarkRouter.post("/remove", csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;

  try {
    if (!req.isAuthenticated()) {
      res.redirect("/user/login");
      return;
    }
    const userId = (req.user as {id: number}).id;

    await bookmarkController.remove(userId, bookId);

    req.flash("success", "ブックマークを削除しました");
    return res.redirect(`/item/${bookId}`);
  } catch (e: any) {
    req.flash("error", "ブックマークの削除に失敗しました");
    logger.error(e);
    res.redirect(`/item/${bookId}`);
    return;
  }
});

export default bookMarkRouter;
