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

requestRouter.post('/register', csrfProtection, async (req: Request, res: Response) => {
  try {
    const bookName = req.body.bookName;
    const authorName = req.body.authorName;
    const publisehrName = req.body.publisehrName;
    const isbn = req.body.isbn;
    const message = req.body.message;

    const departmentId = req.body.department;
    const schoolYear = req.body.schoolYear;
    const schoolClass = req.body.class;
    const userName = req.body.userName;

    await requestApplicationService.register(
        bookName,
        authorName,
        publisehrName,
        isbn,
        message,
        departmentId,
        schoolYear,
        schoolClass,
        userName,
    );
    logger.info(`Request received. Sender Name: ${userName}`);
    req.session.status = {type: 'Success', mes: 'リクエストの記録が完了しました！リクエストありがとうございます！'};
    res.redirect('/');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: 'リクエストの記録に失敗しました'};
    res.redirect('/request');
  }
});

export default requestRouter;
