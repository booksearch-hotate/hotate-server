import {Request, Response, Router} from 'express';
import {IPage} from './../datas/IPage';
import csurf from 'csurf';

import DepartmentRepository from '../../interface/repository/DepartmentRepository';

import DepartmentService from '../../domain/service/departmentService';

import DepartmentApplicationService from '../../application/DepartmentApplicationService';

import db from '../../infrastructure/db';
import Logger from '../../infrastructure/logger/logger';
import conversionpageStatus from '../../modules/conversionPageStatus';

// eslint-disable-next-line new-cap
const departmentRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const logger = new Logger('department');

const departmentApplicationService = new DepartmentApplicationService(new DepartmentRepository(db), new DepartmentService(new DepartmentRepository(db)));

departmentRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  pageData.headTitle = '学科名一覧';

  pageData.anyData = {
    departmentList: await departmentApplicationService.findAllDepartment(),
    isMax: await departmentApplicationService.isMax(),
  };

  pageData.csrfToken = req.csrfToken();

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  res.render('pages/admin/department/index', {pageData});
});

departmentRouter.post('/insert', csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentName = req.body.insertName;

    const isSucceed = await departmentApplicationService.insertDepartment(departmentName); // insertできたか

    if (isSucceed) req.session.status = {type: 'Success', mes: '学科の追加に成功しました'};
    else req.session.status = {type: 'Warning', mes: '学科名が重複しています'};
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '学科の追加に失敗しました'};
  } finally {
    res.redirect('/admin/department/');
  }
});

export default departmentRouter;
