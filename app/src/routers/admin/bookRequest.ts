import {Request, Response, Router} from 'express';
import {IPage} from '../datas/IPage';
import csurf from 'csurf';

import BookRequestApplicationService from '../../application/bookRequestApplicationService';

import BookRequestService from '../../domain/service/bookRequestService';

import RequestRepository from '../../interface/repository/requestRepository';
import DepartmentRepository from '../../interface/repository/departmentRepository';

import Logger from '../../infrastructure/logger/logger';
import db from '../../infrastructure/db';

import conversionpageStatus from '../../utils/conversionPageStatus';

// eslint-disable-next-line new-cap
const bookRequestRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('department');

const requestApplicationService = new BookRequestApplicationService(
    new RequestRepository(db),
    new DepartmentRepository(db),
    new BookRequestService(),
);

bookRequestRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const requests = await requestApplicationService.findAll();

  pageData.headTitle = '本のリクエスト画面の詳細 | HOTATE';
  pageData.csrfToken = req.csrfToken();
  pageData.anyData = {requests};

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/admin/book-request/index', {pageData});
});

bookRequestRouter.get('/detail', async (req: Request, res: Response) => {
  try {
    const requestId = req.query.id;

    if (typeof requestId !== 'string') throw new Error('Failed to get id.');

    const requestData = await requestApplicationService.findById(requestId);

    if (requestData === null) throw new Error('Request data did not exist.');

    pageData.headTitle = '本リクエストの詳細 | HOTATE';
    pageData.anyData = {request: requestData};

    res.render('pages/admin/book-request/detail', {pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: 'リクエスト情報の取得に失敗しました'};
    res.redirect('/admin/book-request/');
  }
});

bookRequestRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.deleteId;

    await requestApplicationService.delete(id);
    req.session.status = {type: 'Success', mes: '削除に成功しました。'};
    logger.info(`Request is deleted. id : ${id}`);
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '削除に失敗しました。'};
  } finally {
    res.redirect('/admin/book-request/');
  }
});

export default bookRequestRouter;
