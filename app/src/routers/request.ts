import {Request, Response, Router} from 'express';
import csurf from 'csurf';
import {IPage} from './datas/IPage';

import DepartmentRepository from '../interface/repository/DepartmentRepository';
import RequestRepository from '../interface/repository/RequestRepository';

import DepartmentService from '../domain/service/departmentService';
import RequestService from '../domain/service/requestService';

import DepartmentApplicationService from '../application/DepartmentApplicationService';
import RequestApplicationService from '../application/RequestApplicationService';

import db from '../infrastructure/db';
import Logger from '../infrastructure/logger/logger';

// eslint-disable-next-line new-cap
const requestRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('bookRequest');

const departmentApplicationService = new DepartmentApplicationService(
    new DepartmentRepository(db),
    new DepartmentService(new DepartmentRepository(db)),
);

const requestApplicationService = new RequestApplicationService(
    new RequestRepository(db),
    new RequestService,
);

requestRouter.get('/request', csrfProtection, async (req: Request, res: Response) => {
  pageData.headTitle = '本のリクエスト | HOTATE';

  pageData.anyData = {
    departmentList: await departmentApplicationService.findAllDepartment(),
  };

  pageData.csrfToken = req.csrfToken();

  res.render('pages/request', {pageData});
});

requestRouter.post('/confirm', csrfProtection, async (req: Request, res: Response) => {
  const bookName = req.body.bookName;
  const authorName = req.body.authorName;
  const publisherName = req.body.publisherName;
  const isbn = req.body.isbn;
  const message = req.body.message;

  const departmentId = req.body.department;
  const schoolYear = req.body.schoolYear;
  const schoolClass = req.body.class;
  const userName = req.body.userName;

  const keepReqObj = {
    bookName,
    authorName,
    publisherName,
    isbn,
    message,
    departmentId,
    schoolYear,
    schoolClass,
    userName,
  };

  req.session.keepValue = {keepReqObj};
  return res.redirect('/confirm-request');
});

requestRouter.get('/confirm-request', csrfProtection, async (req: Request, res: Response) => {
  pageData.headTitle = 'リクエスト内容の確認 | HOTATE';

  pageData.csrfToken = req.csrfToken();

  try {
    if (typeof req.session.keepValue !== 'object') throw new Error('The value could not be obtained correctly.');

    const keepReqObj = req.session.keepValue.keepReqObj;

    const reqData = requestApplicationService.makeData(
        keepReqObj.bookName,
        keepReqObj.authorName,
        keepReqObj.publisherName,
        keepReqObj.isbn,
        keepReqObj.message,
        keepReqObj.departmentId,
        keepReqObj.schoolYear,
        keepReqObj.schoolClass,
        keepReqObj.userName,
    );

    pageData.anyData = {request: reqData};

    return res.render('pages/confirm-request', {pageData});
  } catch (e: any) {
    logger.error(e);
    return res.redirect('/');
  }
});

requestRouter.post('/register', csrfProtection, async (req: Request, res: Response) => {
  try {
    /* 上の行の処理とも同じなので共通化した方が良い */
    if (typeof req.session.keepValue !== 'object') throw new Error('The value could not be obtained correctly.');

    const keepReqObj = req.session.keepValue.keepReqObj;

    const requestData = requestApplicationService.makeData(
        keepReqObj.bookName,
        keepReqObj.authorName,
        keepReqObj.publisherName,
        keepReqObj.isbn,
        keepReqObj.message,
        keepReqObj.departmentId,
        keepReqObj.schoolYear,
        keepReqObj.schoolClass,
        keepReqObj.userName,
    );

    const id = requestData.Id;
    const bookName = requestData.BookName;
    const authorName = requestData.AuthorName;
    const publisherName = requestData.PublisherName;
    const isbn = requestData.Isbn;
    const message = requestData.Message;

    const departmentId = requestData.DepartmentId;
    const schoolYear = requestData.SchoolYear;
    const schoolClass = requestData.SchoolClass;
    const userName = requestData.UserName;

    await requestApplicationService.register(
        id,
        bookName,
        authorName,
        publisherName,
        isbn,
        message,
        departmentId,
        schoolYear,
        schoolClass,
        userName,
    );
    logger.info(`Request received. Sender Name: ${userName}`);

    req.session.status = {type: 'Success', mes: 'リクエストの記録が完了しました！リクエストありがとうございます！'};
    req.session.keepValue = undefined;

    res.redirect('/');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: 'リクエストの記録に失敗しました'};
    res.redirect('/request');
  }
});

export default requestRouter;
