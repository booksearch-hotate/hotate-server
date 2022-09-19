import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import Logger from '../../infrastructure/logger/logger';

import BookService from '../../domain/service/bookService';

import BookApplicationService from '../../application/bookApplicationService';
import RecommendationApplicationService from '../../application/recommendationApplicationService';

import BookRepository from '../../interface/repository/bookRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import RecommendationRepository from '../../interface/repository/recommendationRepository';
import RecommendationService from '../../domain/service/recommendationService';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../../interface/repository/authorRepository';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../../interface/repository/publisherRepository';
import {InvalidAccessError, InvalidDataTypeError, OverflowDataError} from '../../presentation/error';
import multer from 'multer';
import appRoot from 'app-root-path';
import conversionImgSize from '../../utils/conversionImgSize';
import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import {IRecommendationThumbnailObj} from '../../domain/model/recommendation/IRecommendationThumbnailObj';
import glob from 'glob';
import {defaultThumbnailReg} from '../datas/defaultThumbnailReg';

// eslint-disable-next-line new-cap
const apiRouter = Router();

const logger = new Logger('api');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

const recommendationApplicationService = new RecommendationApplicationService(
    new RecommendationRepository(db),
    new RecommendationService(),
);

const upload = multer({
  dest: './public/thumbnail/',
  limits: {fileSize: 4 * 1000 * 1000}, // 画像サイズは4MBまでに制限
}); // multerの設定

const csrfProtection = csurf({cookie: false});

/* isbnに対応する画像をopenbdから取得 */
apiRouter.post('/:isbn/imgLink', csrfProtection, async (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  let imgLink = await bookApplicationService.getImgLink(isbn);
  if (imgLink === null) imgLink = '';
  res.json({imgLink});
});

apiRouter.post('/recommendation/book/add', csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookIdUri = '/item/';

    const url = req.body.addUrl;
    const recommendationId = req.body.recommendationId;

    if (typeof url !== 'string' || url.length === 0 || url.indexOf(bookIdUri) === -1) throw new InvalidDataTypeError('Invalid url.');

    const bookId = url.substring(url.indexOf(bookIdUri) + bookIdUri.length);

    const recommendation = await recommendationApplicationService.findById(recommendationId);

    if (recommendationApplicationService.isOverNumberOfBooksWhenAdd(recommendation)) throw new OverflowDataError('The number of books has been exceeded.');

    const book = await bookApplicationService.searchBookById(bookId);

    const isExist = recommendation.RecommendationItems.some((item) => item.BookId === bookId);

    return res.json({book, status: isExist ? 'Exist' : 'Success'});
  } catch (e: any) {
    logger.error(e);
    return res.json({book: {}, status: 'Failure'});
  }
});


apiRouter.post('/recommendation/thumbnail/add', csrfProtection, upload.single('imgFile'), async (req: Request, res: Response) => {
  const sendObj: {
    status: string,
    res: IRecommendationThumbnailObj | null,
  } = {
    status: 'error',
    res: null,
  };
  if (req.file === undefined) throw new InvalidDataTypeError('Thumbnail images could not be retrieved properly.');

  if (req.file.mimetype.indexOf('image/') === -1) throw new InvalidDataTypeError('The file sent is not an image.');

  const inputFilePath = req.file.path;

  const extName = path.extname(req.file.originalname);

  const fileName = uuidv4();

  await conversionImgSize(inputFilePath, `${appRoot.path}/public/thumbnail/${fileName}${extName}`);

  fs.unlinkSync(req.file.path);

  sendObj.status = 'success';
  sendObj.res = {
    fileName,
    extName,
  };

  return res.json(sendObj);
});

apiRouter.post('/recommendation/thumbnail/delete', csrfProtection, async (req: Request, res: Response) => {
  const fileName = req.body.deleteFileName;

  try {
    if (new RegExp(defaultThumbnailReg, 'g').test(fileName)) {
      throw new InvalidAccessError('Default images cannot be deleted.');
    }

    const filePath = `${appRoot.path}/public/thumbnail/${fileName}`;

    const file = glob.sync(filePath);

    if (file.length > 1 || file.length === 0) {
      throw new InvalidAccessError('Incorrect file name.');
    }

    fs.unlinkSync(file[0]);

    res.sendStatus(200);
  } catch (e: any) {
    logger.error(e);
    res.sendStatus(500);
  }
});

export default apiRouter;
