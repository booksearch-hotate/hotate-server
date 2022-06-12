import {Request, Response, Router} from 'express';

import TagService from '../../domain/service/tagService';
import BookService from '../../domain/service/bookService';

import TagApplicationService from '../../application/TagApplicationService';
import BookApplicationService from '../../application/BookApplicationService';

import TagRepository from '../../interface/repository/TagRepository';
import BookRepository from '../../interface/repository/BookRepository';

import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esSearchBook';

// eslint-disable-next-line new-cap
const apiRouter = Router();

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new TagService(new TagRepository(db)),
);

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

/* isbnに対応する画像をopenbdから取得 */
apiRouter.post('/:isbn/imgLink', async (req: Request, res: Response) => {
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

export default apiRouter;