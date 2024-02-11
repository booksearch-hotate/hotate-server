import csurf from "csurf";
import Logger from "../../../infrastructure/logger/logger";
import {Router, Request, Response} from "express";
import HealthController from "../../../controller/api/admin/HealthController";
import CheckDuplicationBooksUseCase from "../../../usecase/health/checkDuplicationBooksUsecase";
import BookPrismaRepository from "../../../infrastructure/prisma/repository/BookPrismaRepository";
import CheckDBHaveESUseCase from "../../../usecase/health/checkDBHaveESUsecase";
import BookESRepository from "../../../infrastructure/elasticsearch/repository/BookESRepository";
import CheckESHaveDBUsecase from "../../../usecase/health/checkESHaveDBUsecase";
import AddESByDBUseCase from "../../../usecase/health/addESByDBUsecase";
import DeleteESByDBUseCase from "../../../usecase/health/deleteESByDBUsecase";
import db from "../../../infrastructure/prisma/prisma";

// eslint-disable-next-line new-cap
const bookApiRouter = Router();

const logger = new Logger("adminBookApi");

import EsSearchBook from "../../../infrastructure/elasticsearch/esBook";

const healthApiController = new HealthController(
    new CheckDuplicationBooksUseCase(new BookPrismaRepository(db)),
    new CheckDBHaveESUseCase(new BookPrismaRepository(db), new BookESRepository(new EsSearchBook("books"))),
    new CheckESHaveDBUsecase(new BookPrismaRepository(db), new BookESRepository(new EsSearchBook("books"))),
    new AddESByDBUseCase(new BookPrismaRepository(db), new BookESRepository(new EsSearchBook("books"))),
    new DeleteESByDBUseCase(new BookESRepository(new EsSearchBook("books"))),
);

const csrfProtection = csurf({cookie: false});

bookApiRouter.post("/duplication", csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookNames = (await healthApiController.duplicationBooks()).names;

    return res.json({bookNames});
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

bookApiRouter.post("/equaldbtoes", csrfProtection, async (req: Request, res: Response) => {
  try {
    const output = await healthApiController.equalDBtoES();

    if (output.errObj !== null) throw new Error(output.errObj.message);

    return res.json({notEqualDbIds: output.ids});
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

bookApiRouter.post("/equalestodb", csrfProtection, async (req: Request, res: Response) => {
  try {
    const output = await healthApiController.equalEStoDB();

    if (output.errObj !== null) throw new Error(output.errObj.message);

    return res.json({notEqualDbIds: output.ids});
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

bookApiRouter.post("/add-es", csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookIds = await req.body.idList;

    await healthApiController.addESByDB(bookIds);

    return res.sendStatus(200);
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

bookApiRouter.post("/delete-books-to-es", csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookIds = await req.body.idList;

    await healthApiController.deleteESByDB(bookIds);

    return res.sendStatus(200);
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

export default bookApiRouter;

