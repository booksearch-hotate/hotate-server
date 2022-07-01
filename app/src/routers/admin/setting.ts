import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import Logger from '../../infrastructure/logger/logger';

import {IPage} from '../datas/IPage';

import AdminApplicationService from '../../application/AdminApplicationService';

import AdminRepository from '../../interface/repository/AdminRepository';

import AdminService from '../../domain/service/adminService';

import AdminSession from '../../infrastructure/session';
import db from '../../infrastructure/db';

// eslint-disable-next-line new-cap
const settingRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const admin = new AdminSession();

const logger = new Logger('admin-setting');

const adminApplicationService = new AdminApplicationService(
    new AdminRepository(db),
    new AdminService(),
);

/* タグ管理画面 */
settingRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  pageData.headTitle = '管理者設定画面';

  pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/setting/index', {pageData});
});

settingRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const pw = req.body.pw;

  try {
    await adminApplicationService.updateAdmin(id, pw);
    req.session.status = {type: 'Success', mes: '更新が完了しました。再度ログインしてください。'};

    logger.info(`id and pw changes have been completed.  id: ${id}, length of pw: ${pw.length}`);

    admin.delete(req);

    res.redirect('/login');
  } catch (e: any) {
    req.session.status = {type: 'Failure', mes: '更新に失敗しました。', error: e};
    logger.error('Failed to change id and pw.');

    res.redirect('/admin/setting/');
  }
});

export default settingRouter;
