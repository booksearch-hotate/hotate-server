import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import Logger from '../../infrastructure/logger/logger';

import TagService from '../../domain/service/tagService';
import BookService from '../../domain/service/bookService';

import TagApplicationService from '../../application/tagApplicationService';
import BookApplicationService from '../../application/bookApplicationService';

import TagRepository from '../../interface/repository/tagRepository';
import BookRepository from '../../interface/repository/bookRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';

// eslint-disable-next-line new-cap
const apiRouter = Router();

const logger = new Logger('api');

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new BookRepository(db, new EsSearchBook('books')),
    new TagService(new TagRepository(db)),
);

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

const csrfProtection = csurf({cookie: false});

/* isbnに対応する画像をopenbdから取得 */
apiRouter.post('/:isbn/imgLink', csrfProtection, async (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  let imgLink = await bookApplicationService.getImgLink(isbn);
  if (imgLink === null) imgLink = '';
  res.json({imgLink});
});

/* 本IDに対応するタグを作成 */
apiRouter.post('/:bookId/tag', async (req: Request, res: Response) => {
  let status = '';
  try {
    const name: string = req.body.name;
    const bookId = req.params.bookId;
    const isExist = await tagApplicationService.create(name, bookId);
    status = isExist ? 'duplicate' : 'success';
    res.json({status});
  } catch (e) {
    status = 'error';
    res.json({status});
  }
});

apiRouter.post('/recommendation/book/add', csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookIdUri = '/item/';
    const url = req.body.addUrl;
    if (typeof url !== 'string' || url.length === 0 || url.indexOf(bookIdUri) === -1) throw new Error('Invalid url.');

    const bookId = url.substring(url.indexOf(bookIdUri) + bookIdUri.length);

    const book = await bookApplicationService.searchBookById(bookId);
    return res.json({book, status: 'Success'});
  } catch (e: any) {
    logger.error(e);
    return res.json({book: {}, status: 'Failure'});
  }
});

export default apiRouter;
