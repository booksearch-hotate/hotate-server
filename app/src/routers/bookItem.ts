import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import BookService from '../domain/service/bookService';
import TagService from '../domain/service/tagService';

import BookApplicationService from '../application/bookApplicationService';
import TagApplicationService from '../application/tagApplicationService';
import RecommendationApplicationService from '../application/recommendationApplicationService';

import BookRepository from '../interface/repository/bookRepository';
import TagRepository from '../interface/repository/tagRepository';

import db from '../infrastructure/db';
import EsSearchBook from '../infrastructure/elasticsearch/esBook';
import Logger from '../infrastructure/logger/logger';
import AdminSession from '../presentation/session';

import BookData from '../domain/model/book/bookData';

import {IPage} from './datas/IPage';

import conversionpageStatus from '../utils/conversionPageStatus';
import EsAuthor from '../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../interface/repository/authorRepository';
import EsPublisher from '../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../interface/repository/publisherRepository';
import RecommendationRepository from '../interface/repository/recommendationRepository';
import RecommendationService from '../domain/service/recommendationService';
import {IRecommendationObj} from '../domain/model/recommendation/IRecommendationObj';

// eslint-disable-next-line new-cap
const bookItemRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const admin = new AdminSession();

const logger = new Logger('home');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
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

/* 本詳細画面 */
bookItemRouter.get('/item/:bookId', csrfProtection, async (req: Request, res: Response) => {
  const id = req.params.bookId; // 本のID
  let bookData: BookData;
  const isLogin = admin.verifyToken(req.session.token);
  try {
    bookData = await bookApplicationService.searchBookById(id);

    // 本の題名に近い題名の本を検索
    const nearCategoryBookDatas = await bookApplicationService.searchBooks(
        bookData.BookName,
        'none',
        'book',
        0,
        9,
    ).then((res) => res.books);

    const recommendationSection = await recommendationApplicationService.findRecommendationByBookId(bookData.Id);

    let recommendation: IRecommendationObj | null = null;

    if (recommendationSection !== null) {
      const items = await Promise.all(recommendationSection.RecommendationItems.map(async (item) => {
        return {
          book: await bookApplicationService.searchBookById(item.BookId),
          comment: item.Comment,
        };
      }));

      recommendation = {
        recommendation: recommendationSection,
        items,
      };
    }

    pageData.headTitle = `${bookData.BookName} | HOTATE`;
    pageData.anyData = {bookData, isError: false, isLogin, nearCategoryBookDatas, recommendation};

    pageData.csrfToken = req.csrfToken();
  } catch {
    logger.warn(`Not found bookId: ${id}`);
    pageData.headTitle = '本が見つかりませんでした。';
    pageData.anyData = {isError: true};
  } finally {
    pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    res.render('pages/item', {pageData});
  }
});

/* タグ追加処理 */
bookItemRouter.post('/tag/insert', csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;
  try {
    const name: string = req.body.tagName;
    const isExist = await tagApplicationService.create(name, bookId);
    if (isExist) req.session.status = {type: 'Warning', mes: `${name}は既に登録されています`};
    else req.session.status = {type: 'Success', mes: `${name}の登録が完了しました`};
  } catch (e: any) {
    logger.error(e as string);
    req.session.status = {type: 'Failure', error: e, mes: '登録に失敗しました'};
  } finally {
    res.redirect(`/item/${bookId}`);
  }
});

export default bookItemRouter;
