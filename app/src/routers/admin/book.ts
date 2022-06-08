import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../../domain/service/bookService';

import BookApplicationService from '../../application/BookApplicationService';

import BookRepository from '../../interface/repository/BookRepository';


import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esSearchBook';

import {IPage} from '../datas/IPage';
import {IPaginationData} from '../datas/IPaginationData';

import getPaginationInfo from '../../modules/getPaginationInfo';
import conversionpageCounter from '../../modules/conversionPageCounter';

// eslint-disable-next-line new-cap
const bookRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

bookRouter.get('/', async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const books = await bookApplicationService.findAll(pageCount);

  const total = await bookApplicationService.findAllCount();

  const paginationInfo = getPaginationInfo(pageCount, total);

  const paginationData: IPaginationData = {
    pageRange: {
      min: paginationInfo.minPage,
      max: paginationInfo.maxPage,
    },
    totalPage: paginationInfo.totalPage,
    pageCount,
  };

  pageData.headTitle = '本の管理';
  pageData.anyData = {
    books,
    paginationData,
    bookCount: total,
  };
  res.render('pages/admin/book/', {pageData});
});

/* 本の編集画面 */
bookRouter.get('/edit', csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== 'string') return res.redirect('/admin/book');

  const book = await bookApplicationService.searchBookById(id);

  pageData.headTitle = '本編集';
  pageData.anyData = {book};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/book/edit', {pageData});
});

/* 本の更新処理 */
bookRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.id;

  const book = await bookApplicationService.searchBookById(bookId);
  await bookApplicationService.update(
      bookId,
      req.body.title,
      req.body.bookSubName,
      req.body.bookContent,
      req.body.isbn,
      req.body.ndc,
      req.body.year,
      book.AuthorId,
      book.AuthorName,
      book.PublisherId,
      book.PublisherName,
  );

  res.redirect('/admin/book');
});

export default bookRouter;
