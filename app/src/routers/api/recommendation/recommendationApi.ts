import sanitize from "sanitize-filename";
import {Router, Request, Response} from "express";
import {InvalidDataTypeError} from "../../../presentation/error";
import csurf from "csurf";
import multer from "multer";
import RecommendationApiController from "../../../controller/api/admin/RecommendationApiController";
import FindRecommendationUseCase from "../../../usecase/recommendation/FindRecommendationUsecase";
import RecommendationPrismaRepository from "../../../infrastructure/prisma/repository/RecommendationPrismaRepository";
import FetchBookUsecase from "../../../usecase/book/FetchBookUsecase";
import BookPrismaRepository from "../../../infrastructure/prisma/repository/BookPrismaRepository";
import FetchThumbnailNamesUseCase from "../../../usecase/thumbnail/FetchThumbnailNamesUsecase";
import ThumbnailFileRepository from "../../../infrastructure/fileAccessor/thumbnail/repository/ThumbnailFileRepositoy";
import ThumbnailFileAccessor from "../../../infrastructure/fileAccessor/thumbnail/thumbnailFile";
import SaveThumbnailUseCase from "../../../usecase/thumbnail/SaveThumbnailUsecase";
import DeleteThumbnailUseCase from "../../../usecase/thumbnail/DeleteThumbnailUsecase";
import db from "../../../infrastructure/prisma/prisma";
import Logger from "../../../infrastructure/logger/logger";

// eslint-disable-next-line new-cap
const recommendationApiRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("recommendationApi.ts");

const upload = multer({
  dest: "./public/thumbnail/",
  limits: {fileSize: 4 * 1000 * 1000}, // 画像サイズは4MBまでに制限
}); // multerの設定

const recommendationApiController = new RecommendationApiController(
    new FindRecommendationUseCase(new RecommendationPrismaRepository(db)),
    new FetchBookUsecase(new BookPrismaRepository(db)),
    new FetchThumbnailNamesUseCase(new ThumbnailFileRepository(new ThumbnailFileAccessor())),
    new SaveThumbnailUseCase(new ThumbnailFileRepository(new ThumbnailFileAccessor())),
    new DeleteThumbnailUseCase(new ThumbnailFileRepository(new ThumbnailFileAccessor())),
);

recommendationApiRouter.post("/book/add", csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookIdUri = "/item/";

    const url = req.body.addUrl;
    const recommendationId = req.body.recommendationId;

    if (typeof url !== "string" || url.length === 0 || url.indexOf(bookIdUri) === -1) throw new InvalidDataTypeError("Invalid url.");

    const bookId = url.substring(url.indexOf(bookIdUri) + bookIdUri.length);

    const output = await recommendationApiController.bookAdd(recommendationId, bookId);

    const book = output.book;

    const isExist = output.isExistBook;

    return res.json({book, status: isExist ? "Exist" : "Success"});
  } catch (e: any) {
    logger.error(e);
    return res.json({book: {}, status: "Failure"});
  }
});


recommendationApiRouter.post("/thumbnail/add", csrfProtection, upload.single("imgFile"), async (req: Request, res: Response) => {
  const sendObj: {
    status: string,
    fileName: string | null,
  } = {
    status: "error",
    fileName: null,
  };

  try {
    if (req.file === undefined) throw new InvalidDataTypeError("Thumbnail images could not be retrieved properly.");

    if (req.file.mimetype.indexOf("image/") === -1) throw new InvalidDataTypeError("The file sent is not an image.");

    const output = await recommendationApiController.thumbnailAdd(sanitize(req.file.filename));

    sendObj.status = "success";
    sendObj.fileName = output.fileName;

    return res.json(sendObj);
  } catch (e: any) {
    logger.error(e);

    res.sendStatus(500);
  }
});

recommendationApiRouter.post("/thumbnail/delete", csrfProtection, async (req: Request, res: Response) => {
  const fileName = req.body.deleteFileName;

  try {
    recommendationApiController.thumbnailDelete(fileName);

    res.sendStatus(200);
  } catch (e: any) {
    logger.error(e);
    res.sendStatus(500);
  }
});

export default recommendationApiRouter;
