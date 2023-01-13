import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../../domain/service/bookService';
import AuthorService from '../../domain/service/authorService';
import PublisherService from '../../domain/service/publisherService';

import BookApplicationService from '../../application/bookApplicationService';
import AuthorApplicationService from '../../application/authorApplicationService';
import PublisherApplicationService from '../../application/publisherApplicationService';
import TagApplicationService from '../../application/tagApplicationService';

import BookRepository from '../../interface/repository/bookRepository';
import AuthorRepository from '../../interface/repository/authorRepository';
import PublisherRepository from '../../interface/repository/publisherRepository';


import db from '../../infrastructure/db';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import EsAuthor from '../../infrastructure/elasticsearch/esAuthor';
import EsPublisher from '../../infrastructure/elasticsearch/esPublisher';
import Logger from '../../infrastructure/logger/logger';

import getPaginationInfo from '../../utils/getPaginationInfo';
import conversionpageCounter from '../../utils/conversionPageCounter';
import isSameLenAllArray from '../../utils/isSameLenAllArray';
import conversionpageStatus from '../../utils/conversionPageStatus';
import TagRepository from '../../interface/repository/tagRepository';
import TagService from '../../domain/service/tagService';
import RecommendationApplicationService from '../../application/recommendationApplicationService';
import RecommendationRepository from '../../interface/repository/recommendationRepository';
import RecommendationService from '../../domain/service/recommendationService';
import {InvalidDataTypeError, NullDataError} from '../../presentation/error';

// eslint-disable-next-line new-cap
const bookRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('admin-book');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
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

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new BookRepository(db, new EsSearchBook('books')),
    new TagService(new TagRepository(db)),
);

const recommendationApplicationService = new RecommendationApplicationService(
    new RecommendationRepository(db),
    new RecommendationService(),
);

bookRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const FETCH_MARGIN = 10; // 一度に取得する本の個数

  const books = await bookApplicationService.findAll(pageCount, FETCH_MARGIN);

  const total = await bookApplicationService.findAllCount();

  const paginationData = getPaginationInfo(pageCount, total, FETCH_MARGIN, 10);

  res.pageData.headTitle = '本の管理';
  res.pageData.anyData = {
    books,
    paginationData,
    bookCount: total,
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/book/', {pageData: res.pageData});
});

/* 本の編集画面 */
bookRouter.get('/edit', csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== 'string') return res.redirect('/admin/book');

  const book = await bookApplicationService.searchBookById(id);

  res.pageData.headTitle = '本編集';
  res.pageData.anyData = {book};
  res.pageData.csrfToken = req.csrfToken();
  return res.render('pages/admin/book/edit', {pageData: res.pageData});
});

/* 本の更新処理 */
bookRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookId = req.body.id;

    if (typeof bookId !== 'string') throw new InvalidDataTypeError('Invalid request id.');

    const book = await bookApplicationService.searchBookById(bookId);
    /* 変更前のauthorId、publisherIdを取得 */
    const beforeAuthorId = book.AuthorId;
    const beforePublisherId = book.PublisherId;

    let afterAuthorId = beforeAuthorId;
    let afterPublisherId = beforePublisherId;

    const authorName = req.body.authorName;
    const publisherName = req.body.publisherName;

    // 著者名の変更を全ての本に適用する場合
    if (req.body.changeAuthorApply === 'true') {
      await authorApplicationService.update(beforeAuthorId, authorName);
    } else {
      afterAuthorId = await authorApplicationService.createAuthor(authorName, false);
    }

    if (req.body.changePublisherApply === 'true') {
      await publisherApplicationService.update(beforePublisherId, publisherName);
    } else {
      afterPublisherId = await publisherApplicationService.createPublisher(publisherName, false);
    }

    await bookApplicationService.update(
        bookId,
        req.body.title,
        req.body.bookSubName,
        req.body.bookContent,
        req.body.isbn,
        req.body.ndc,
        req.body.year,
        afterAuthorId,
        authorName,
        afterPublisherId,
        publisherName,
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
<<<<<<< HEAD
  res.pageData.headTitle = '本の追加';

=======
  let count = Number(req.query.c as string);

  if (isNaN(count) || count <= 0) count = 1;

  if (count > 10) count = 10;

  res.pageData.headTitle = '本の追加';
  res.pageData.anyData = {count};
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
  res.pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/book/add', {pageData: res.pageData});
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

    if (!isSameLen) throw new InvalidDataTypeError('Datas could not be successfully retrieved.');

    for (let i = 0; i < req.body.isbn.length; i++) {
      if (req.body.bookName[i] === '') throw new NullDataError('Name of book is empty.');
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
          false,
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
    if (typeof id !== 'string') throw new InvalidDataTypeError('Invalid request id');

    if ((await tagApplicationService.findByBookId(id)).length > 0) await tagApplicationService.deleteByBookId(id);

<<<<<<< HEAD
    if (await recommendationApplicationService.findByBookId(id) !== null) {
=======
    if (await recommendationApplicationService.findOneByBookId(id) !== null) {
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
      await recommendationApplicationService.removeUsingByBookId(id);
    }

    const book = await bookApplicationService.searchBookById(id);

    await bookApplicationService.deleteBook(id);

    await Promise.all([authorApplicationService.deleteNotUsed(book.AuthorId), publisherApplicationService.deleteNotUsed(book.PublisherId)]);

    req.session.status = {type: 'Success', mes: '本の削除が完了しました'};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '本の削除に失敗しました'};
  } finally {
    res.redirect('/admin/book');
  }
});

/* 本を全て削除 */
bookRouter.post('/delete-all', csrfProtection, async (req: Request, res: Response) => {
  try {
    if (await tagApplicationService.isExistTable()) await tagApplicationService.deleteAll();
    await recommendationApplicationService.removeUsingAll();
    await bookApplicationService.deleteBooks();
    await publisherApplicationService.deletePublishers();
    await authorApplicationService.deleteAuthors();

    req.session.status = {type: 'Success', mes: '本の全削除に成功しました。'};
    logger.info('Succeeded in deleting all the books.');
  } catch (e: any) {
    req.session.status = {type: 'Failure', error: e, mes: '本の全削除に失敗しました。'};
    logger.error(e as string);
    logger.error('Failed to delete all books.');
  } finally {
    res.redirect('/admin/book');
  }
});

export default bookRouter;
