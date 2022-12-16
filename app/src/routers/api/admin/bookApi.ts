import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import Logger from '../../../infrastructure/logger/logger';

import BookService from '../../../domain/service/bookService';

import BookApplicationService from '../../../application/bookApplicationService';

import BookRepository from '../../../interface/repository/bookRepository';

import db from '../../../infrastructure/db';
import EsSearchBook from '../../../infrastructure/elasticsearch/esBook';
import EsAuthor from '../../../infrastructure/elasticsearch/esAuthor';
import AuthorRepository from '../../../interface/repository/authorRepository';
import EsPublisher from '../../../infrastructure/elasticsearch/esPublisher';
import PublisherRepository from '../../../interface/repository/publisherRepository';

// eslint-disable-next-line new-cap
const bookApiRouter = Router();

const logger = new Logger('adminBookApi');

const bookApplicationService = new BookApplicationService(
    new BookRepository(db, new EsSearchBook('books')),
    new AuthorRepository(db, new EsAuthor('authors')),
    new PublisherRepository(db, new EsPublisher('publishers')),
    new BookService(),
);

const csrfProtection = csurf({cookie: false});

bookApiRouter.post('/duplication', csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookNames = await bookApplicationService.checkDuplicationBooks();

    return res.json({bookNames});
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

bookApiRouter.post('/equaldbtoes', csrfProtection, async (req: Request, res: Response) => {
  try {
    const notEqualDbIds = await bookApplicationService.checkEqualDbAndEs();

    return res.json({notEqualDbIds});
  } catch (e) {
    logger.error(e as string);
    return res.sendStatus(500);
  }
});

export default bookApiRouter;
