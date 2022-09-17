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
import {InvalidDataTypeError, OverflowDataError} from '../../presentation/error';

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

export default apiRouter;
