import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../../domain/service/bookService';
import AuthorService from '../../domain/service/authorService';
import PublisherService from '../../domain/service/publisherService';

import BookApplicationService from '../../application/bookApplicationService';
import AuthorApplicationService from '../../application/authorApplicationService';
import PublisherApplicationService from '../../application/publisherApplicationService';

import BookRepository from '../../interface/repository/bookRepository';
import AuthorRepository from '../../interface/repository/authorRepository';
import PublisherRepository from '../../interface/repository/publisherRepository';


import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';
import Logger from '../../infrastructure/logger/logger';

import {IPage} from '../datas/IPage';
import {IPaginationData} from '../datas/IPaginationData';

import getPaginationInfo from '../../utils/getPaginationInfo';
import conversionpageCounter from '../../utils/conversionPageCounter';
import isSameLenAllArray from '../../utils/isSameLenAllArray';
import conversionpageStatus from '../../utils/conversionPageStatus';

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
    new AuthorRepository(db, new EsAuthor('authors')),
    new AuthorService(new AuthorRepository(db, new EsAuthor('authors'))),
);

const publisherApplicationService = new PublisherApplicationService(
    new PublisherRepository(db, new EsPublisher('publishers')),
    new PublisherService(new PublisherRepository(db, new EsPublisher('publishers'))),
);

bookRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
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

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  pageData.csrfToken = req.csrfToken();

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
  try {
    const bookId = req.body.id;

    const book = await bookApplicationService.searchBookById(bookId);
    /* 変更前のauthorId、publisherIdを取得 */
    const beforeAuthorId = book.AuthorId;
    const beforePublisherId = book.PublisherId;

    /* 既に同名が存在する場合はそのauthorIdを、存在しない場合は登録しそのIDを取得 */
    const createList = [
      authorApplicationService.createAuthor(req.body.authorName, false),
      publisherApplicationService.createPublisher(req.body.publisherName, false),
    ];
    const [authorId, publisherId] = await Promise.all(createList);

    await bookApplicationService.update(
        bookId,
        req.body.title,
        req.body.bookSubName,
        req.body.bookContent,
        req.body.isbn,
        req.body.ndc,
        req.body.year,
        authorId,
        req.body.authorName,
        publisherId,
        req.body.publisherName,
    );

    /* 使用されていない著者(出版社)を削除 */
    const deleteNotUsedList = [
      authorApplicationService.deleteNotUsed(beforeAuthorId),
      publisherApplicationService.deleteNotUsed(beforePublisherId),
    ];
    await Promise.all(deleteNotUsedList);

    req.session.status = {type: 'Success', mes: '本の更新が完了しました'};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '本の更新に失敗しました'};
  } finally {
    res.redirect('/admin/book');
  }
});

/* 本の追加画面 */
bookRouter.get('/add', csrfProtection, (req: Request, res: Response) => {
  let count = Number(req.query.c as string);

  if (isNaN(count) || count <= 0) count = 1;

  if (count > 10) count = 10;

  pageData.headTitle = '本の追加';
  pageData.anyData = {count};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/book/add', {pageData});
});

/* 本の追加処理 */
bookRouter.post('/add', csrfProtection, async (req: Request, res: Response) => {
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
      if (req.body.bookName[i] === '') throw new Error('Name of book is empty.');
      const authorName = req.body.authorName[i];
      const publisherName = req.body.publisherName[i];

      const authorId = await authorApplicationService.createAuthor(authorName, false);
      const publisherId = await publisherApplicationService.createPublisher(publisherName, false);

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

    req.session.status = {type: 'Success', mes: `${req.body.isbn.length}冊の本を追加しました`};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '本の追加中にエラーが発生しました'};
  } finally {
    res.redirect('/admin/book');
  }
});

/* 本の削除機能 */
bookRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    await bookApplicationService.deleteBook(id);
    req.session.status = {type: 'Success', mes: '本の削除が完了しました'};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '本の削除に失敗しました'};
  } finally {
    res.redirect('/admin/book');
  }
});

export default bookRouter;
