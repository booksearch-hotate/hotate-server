import {NextFunction, Router, Request, Response} from 'express';
import BookmarkApplicationService from '../../application/bookmarkApplicationService';
import BookmarkRepository from '../../interface/repository/bookmarkRepository';
import db from '../../infrastructure/prisma/prisma';
import BookRepository from '../../interface/repository/bookRepository';
import UserRepository from '../../interface/repository/userRepository';
import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import Logger from '../../infrastructure/logger/logger';
import csurf from 'csurf';

// eslint-disable-next-line new-cap
const bookMarkRouter = Router();

const bookmarkApplicationService = new BookmarkApplicationService(
    new BookmarkRepository(db),
    new BookRepository(db, new EsSearchBook('books')),
    new UserRepository(db),
);

const csrfProtection = csurf({cookie: false});

const logger = new Logger('bookMarkRouter');

bookMarkRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (!!req.user && req.isAuthenticated()) next();
  else return res.redirect('/user/login');
});

bookMarkRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = 'ブックマーク一覧';

  res.pageData.csrfToken = req.csrfToken();

  res.pageData.anyData = {
    bookmarks: await bookmarkApplicationService.getBookmarksByUserId((req.user as {id: number}).id),
  };

  res.render('pages/user/bookmark/index', {pageData: res.pageData});
});

bookMarkRouter.post('/insert', csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;

  try {
    if (!req.isAuthenticated()) {
      res.redirect('/user/login');
      return;
    }
    const userId = (req.user as {id: number}).id;

    await bookmarkApplicationService.insert(userId, bookId);

    req.flash('success', 'ブックマークを登録しました');
    return res.redirect(`/item/${bookId}`);
  } catch (e: any) {
    req.flash('error', 'ブックマークの登録に失敗しました');
    logger.error(e);
    res.redirect(`/item/${bookId}`);
    return;
  }
});

bookMarkRouter.post('/remove', csrfProtection, async (req: Request, res: Response) => {
  const bookId = req.body.bookId;

  try {
    if (!req.isAuthenticated()) {
      res.redirect('/user/login');
      return;
    }
    const userId = (req.user as {id: number}).id;

    await bookmarkApplicationService.remove(userId, bookId);

    req.flash('success', 'ブックマークを削除しました');
    return res.redirect(`/item/${bookId}`);
  } catch (e: any) {
    req.flash('error', 'ブックマークの削除に失敗しました');
    logger.error(e);
    res.redirect(`/item/${bookId}`);
    return;
  }
});

export default bookMarkRouter;
