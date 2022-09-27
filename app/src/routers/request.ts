import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import {FormInvalidError, NullDataError} from '../presentation/error';

import DepartmentRepository from '../interface/repository/departmentRepository';
import RequestRepository from '../interface/repository/requestRepository';

import DepartmentService from '../domain/service/departmentService';
import BookRequestService from '../domain/service/bookRequestService';

import DepartmentApplicationService from '../application/departmentApplicationService';
import BookRequestApplicationService from '../application/bookRequestApplicationService';

import db from '../infrastructure/db';
import Logger from '../infrastructure/logger/logger';

import conversionpageStatus from '../utils/conversionPageStatus';
import SchoolGradeInfoApplicationService from '../application/schoolGradeInfoApplication';
import SchoolYearRepository from '../interface/repository/schoolYearRepository';

// eslint-disable-next-line new-cap
const requestRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('bookRequest');

const departmentApplicationService = new DepartmentApplicationService(
    new DepartmentRepository(db),
    new RequestRepository(db),
    new DepartmentService(new DepartmentRepository(db)),
);

const requestApplicationService = new BookRequestApplicationService(
    new RequestRepository(db),
    new DepartmentRepository(db),
    new BookRequestService,
);

const schoolGradeInfoApplicationService = new SchoolGradeInfoApplicationService(
    new SchoolYearRepository(db),
);

requestRouter.get('/request', csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = '本のリクエスト ';

  const keepReqObj = typeof req.session.keepValue === 'object' ? req.session.keepValue.keepReqObj : {};

  const departmentList = await departmentApplicationService.findAllDepartment();

  if (departmentList.length === 0) {
    logger.error('The book request service is not available because the department is not set up.');
    req.session.status = {type: 'Warning', mes: '現在本リクエスト機能は使用できません。'};
    return res.redirect('/');
  }

  res.pageData.anyData = {
    departmentList,
    saveVal: keepReqObj,
    schoolGradeInfo: await schoolGradeInfoApplicationService.find(),
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.pageData.csrfToken = req.csrfToken();

  return res.render('pages/request', {pageData: res.pageData});
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
  res.pageData.headTitle = 'リクエスト内容の確認 ';

  res.pageData.csrfToken = req.csrfToken();

  try {
    const reqData = await requestApplicationService.makeData(req.session.keepValue);

    res.pageData.anyData = {request: reqData};

    return res.render('pages/confirm-request', {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);

    if (e instanceof FormInvalidError) {
      req.session.status = {type: 'Failure', error: e, mes: 'フォームの入力が間違っています。もう一度お試しください。'};
      return res.redirect('/request');
    }

    req.session.status = {type: 'Failure', error: e, mes: 'リクエスト内容の取得に失敗しました。'};
    return res.redirect('/');
  }
});

requestRouter.post('/register', csrfProtection, async (req: Request, res: Response) => {
  try {
    const requestData = await requestApplicationService.makeData(req.session.keepValue);

    const id = requestData.Id;
    const bookName = requestData.BookName;
    const authorName = requestData.AuthorName;
    const publisherName = requestData.PublisherName;
    const isbn = requestData.Isbn;
    const message = requestData.Message;

    const departmentId = requestData.Department.Id;
    const schoolYear = requestData.SchoolYear;
    const schoolClass = requestData.SchoolClass;
    const userName = requestData.UserName;

    const departmentData = await departmentApplicationService.findById(departmentId);

    // 学科情報が取得できなかった場合はエラー
    if (departmentData === null) throw new NullDataError('The name of the department could not be obtained.');

    await requestApplicationService.register(
        id,
        bookName,
        authorName,
        publisherName,
        isbn,
        message,
        departmentData.Id,
        departmentData.Name,
        schoolYear,
        schoolClass,
        userName,
    );
    logger.info(`Request received. Sender Name: ${userName}`);

    res.redirect('/thanks-request');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: 'リクエストの記録に失敗しました'};
    res.redirect('/request');
  }
});

requestRouter.get('/thanks-request', (req: Request, res: Response) => {
  if (typeof req.session.keepValue === 'undefined') return res.redirect('/');

  req.session.keepValue = undefined;

  res.pageData.headTitle = 'リクエスト完了 ';

  return res.render('pages/thanks-request', {pageData: res.pageData});
});

export default requestRouter;
