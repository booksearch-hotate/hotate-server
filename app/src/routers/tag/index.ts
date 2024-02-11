import csurf from "csurf";
import {Router, Request, Response} from "express";
import TagController from "../../controller/TagController";
import InsertTagToBookUseCase from "../../usecase/tag/InsertTagToBookUseCase";
import TagPrismaRepository from "../../infrastructure/prisma/repository/TagPrismaRepository";
import db from "../../infrastructure/prisma/prisma";
import TagService from "../../domain/service/tagService";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import Logger from "../../infrastructure/logger/logger";

// eslint-disable-next-line new-cap
const tagRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("tagRouter");

const tagController = new TagController(
    new InsertTagToBookUseCase(
        new TagPrismaRepository(db),
        new TagService(new TagPrismaRepository(db)),
        new BookPrismaRepository(db),
    ),
);

tagRouter.post("/insert", csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;
  try {
    const name: string = req.body.tagName;
    const isExist = await tagController.insertTagToBook(bookId, name);
    if (isExist.isExistCombination) req.session.status = {type: "Warning", mes: `${name}は既に登録されています`};
    else req.session.status = {type: "Success", mes: `${name}の登録が完了しました`};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: "Failure", error: e, mes: "登録に失敗しました"};
  } finally {
    res.redirect(`/item/${bookId}`);
  }
});

export default tagRouter;
