import {Request, Response, Router} from 'express';
import {IPage} from './datas/IPage';

import DepartmentRepository from '../interface/repository/DepartmentRepository';

import DepartmentService from '../domain/service/departmentService';

import DepartmentApplicationService from '../application/DepartmentApplicationService';

import db from '../infrastructure/db';

// eslint-disable-next-line new-cap
const requestRouter = Router();

const pageData: IPage = {} as IPage;

const departmentApplicationService = new DepartmentApplicationService(new DepartmentRepository(db), new DepartmentService(new DepartmentRepository(db)));

requestRouter.get('/request', async (req: Request, res: Response) => {
  pageData.headTitle = '本のリクエスト | HOTATE';

  pageData.anyData = {
    departmentList: await departmentApplicationService.findAllDepartment(),
  };

  res.render('pages/request', {pageData});
});

export default requestRouter;
