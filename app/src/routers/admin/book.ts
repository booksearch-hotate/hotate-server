import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../../domain/service/bookService';
import AuthorService from '../../domain/service/authorService';
import PublisherService from '../../domain/service/publisherService';

import BookApplicationService from '../../application/BookApplicationService';
import AuthorApplicationService from '../../application/AuthorApplicationService';
import PublisherApplicationService from '../../application/PublisherApplicationService';

import BookRepository from '../../interface/repository/BookRepository';
import AuthorRepository from '../../interface/repository/AuthorRepository';
import PublisherRepository from '../../interface/repository/PublisherRepository';


import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esSearchBook';
import EsCsv from '../../infrastructure/elasticsearch/esCsv';
import Logger from '../../infrastructure/logger/logger';

import {IPage} from '../datas/IPage';
import {IPaginationData} from '../datas/IPaginationData';

import getPaginationInfo from '../../modules/getPaginationInfo';
import conversionpageCounter from '../../modules/conversionPageCounter';
import isSameLenAllArray from '../../modules/isSameLenAllArray';

// eslint-disable-next-line new-cap
const bookRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('admin-book');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new BookService(),
);

const authorApplicationService = new AuthorApplicationService(
    new AuthorRepository(db, new EsCsv('authors')),
    new AuthorService(new AuthorRepository(db, new EsCsv('authors'))),
);

const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsCsv('publishers')),
    new PublisherService(new PublisherRepository(db, new EsCsv('publishers'))),
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

/* 本の追加画面 */
bookRouter.get('/add', (req: Request, res: Response) => {
  let count = Number(req.query.c as string);

  if (isNaN(count) || count <= 0) count = 1;

  if (count > 10) count = 10;

  pageData.headTitle = '本の追加';
  pageData.anyData = {count};
  res.render('pages/admin/book/add', {pageData});
});

/* 本の追加処理 */
bookRouter.post('/add', async (req: Request, res: Response) => {
  console.log(req.body);
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

    if (!isSameLen) throw new Error('Datas could not be successfully retrieved.');

    for (let i = 0; i < req.body.isbn.length; i++) {
      const authorName = req.body.authorName[i];
      const publisherName = req.body.publisherName[i];

      const authorId = await authorApplicationService.createAuthor(authorName);
      const publisherId = await publisherApplicationService.createPublisher(publisherName);

      await bookApplicationService.createBook(
          req.body.bookName[i],
          req.body.bookSubName[i],
          req.body.content[i],
          req.body.isbn[i],
          req.body.ndc[i],
          req.body.year[i],
          authorId,
          authorName,
          publisherId,
          publisherName,
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    res.redirect('/admin/book');
  }
});

export default bookRouter;
