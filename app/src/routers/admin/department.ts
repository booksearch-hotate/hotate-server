import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import DepartmentRepository from '../../interface/repository/departmentRepository';
import RequestRepository from '../../interface/repository/requestRepository';

import DepartmentService from '../../domain/model/department/departmentService';

import DepartmentApplicationService from '../../application/departmentApplicationService';

import db from '../../infrastructure/prisma/prisma';
import Logger from '../../infrastructure/logger/logger';
import conversionpageStatus from '../../utils/conversionPageStatus';
import SchoolGradeInfoApplicationService from '../../application/schoolGradeInfoApplication';
import SchoolYearRepository from '../../interface/repository/schoolYearRepository';
import {InvalidDataTypeError, NullDataError} from '../../presentation/error';

// eslint-disable-next-line new-cap
const departmentRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger('department');

const departmentApplicationService = new DepartmentApplicationService(
    new DepartmentRepository(db),
    new RequestRepository(db),
    new DepartmentService(new DepartmentRepository(db)),
);

const schoolGradeInfoApplicationService = new SchoolGradeInfoApplicationService(
    new SchoolYearRepository(db),
);

departmentRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = '学科名一覧';

  res.pageData.anyData = {
    departmentList: await departmentApplicationService.findAllDepartment(),
    isMax: await departmentApplicationService.isMax(),
    schoolGradeInfo: await schoolGradeInfoApplicationService.find(),
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  res.pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/school-info/index', {pageData: res.pageData});
});

departmentRouter.post('/grade-info/update', csrfProtection, async (req: Request, res: Response) => {
  try {
    const year = Number(req.body.year);
    const schoolClass = Number(req.body.schoolClass);
    await schoolGradeInfoApplicationService.update(year, schoolClass);

    req.session.status = {type: 'Success', mes: '学年・クラスの変更に成功しました。'};
    logger.info('Grade or class are updated.');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '学年・クラスの変更に失敗しました。'};
  } finally {
    res.redirect('/admin/school-info');
  }
});

departmentRouter.post('/insert', csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentName = req.body.insertName;

    const isSucceed = await departmentApplicationService.insertDepartment(departmentName); // insertできたか

    if (isSucceed) {
      req.session.status = {type: 'Success', mes: '学科の追加に成功しました'};
      logger.info(`Department is added. Name: ${departmentName}`);
    } else {
      req.session.status = {type: 'Warning', mes: '学科名が重複しています'};
    }
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '学科の追加に失敗しました'};
  } finally {
    res.redirect('/admin/school-info/');
  }
});

departmentRouter.get('/confirm-delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentId = req.query.did;

    if (typeof departmentId !== 'string') throw new InvalidDataTypeError('Invalid request id.');

    const department = await departmentApplicationService.findById(departmentId);

    if (department === null) throw new NullDataError('The department content cannot find.');

    const bookRequestsHaveId = await departmentApplicationService.findBookRequestById(departmentId);

    res.pageData.headTitle = '学科名の削除';

    res.pageData.anyData = {
      department: department,
      bookRequests: bookRequestsHaveId,
    };

    res.pageData.csrfToken = req.csrfToken();

    return res.render('pages/admin/school-info/confirm-delete', {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '学科の情報の取得に失敗しました。'};
    res.redirect('/admin/school-info/');
  }
});

departmentRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentId = req.body.deleteId;

    await departmentApplicationService.deleteDepartment(departmentId);

    req.session.status = {type: 'Success', mes: '学科の削除に成功しました'};
    logger.info('Department is deleted.');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '学科の削除に失敗しました'};
  } finally {
    res.redirect('/admin/school-info/');
  }
});

departmentRouter.get('/edit', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const fetchData = await departmentApplicationService.findById(id);

    if (fetchData === null) throw new NullDataError('id does not exist in DB.');

    res.pageData.headTitle = '学科名の編集';

    res.pageData.anyData = {
      department: fetchData,
    };

    res.pageData.csrfToken = req.csrfToken();

    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    req.session.keepValue = id;

    res.render('pages/admin/school-info/edit', {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '編集に必要な情報が正常に取得できませんでした。'};
    res.redirect('/admin/school-info/');
  }
});

departmentRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;

    if (id !== req.session.keepValue) throw new InvalidDataTypeError('There is a discrepancy in the id.');

    await departmentApplicationService.update(id, name);

    req.session.status = {type: 'Success', mes: '変更に成功しました'};
    logger.info('Deparment is updated.');
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: 'Failure', error: e, mes: '変更中にエラーが発生しました。'};
  } finally {
    res.redirect('/admin/school-info');
  }
});

export default departmentRouter;
