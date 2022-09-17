import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import Logger from '../../infrastructure/logger/logger';

import {IPage} from '../datas/IPage';

import AdminApplicationService from '../../application/adminApplicationService';

import AdminRepository from '../../interface/repository/adminRepository';

import AdminService from '../../domain/service/adminService';

import AdminSession from '../../presentation/session';
import db from '../../infrastructure/db';
import {FormInvalidError, InfrastructureError, InvalidAccessError} from '../../presentation/error';
import conversionpageStatus from '../../utils/conversionPageStatus';
import AdminData from '../../domain/model/admin/adminData';

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

  pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  pageData.csrfToken = req.csrfToken();

  res.render('pages/admin/setting/index', {pageData});
});

settingRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const pw = req.body.pw;

  // 変更前のid、パスワード
  const nowId = req.body.nowId;
  const nowPw = req.body.nowPw;

  try {
    const isValid = await adminApplicationService.isValid(new AdminData(nowId, nowPw));

    if (!isValid) throw new InvalidAccessError('Current id or password is incorrect.');

    await adminApplicationService.updateAdmin(id, pw);
    req.session.status = {type: 'Success', mes: '更新が完了しました。再度ログインしてください。'};

    logger.info(`id and pw changes have been completed.  id: ${id}, length of pw: ${pw.length}`);

    admin.delete(req);

    res.redirect('/login');
  } catch (e: any) {
    if (e instanceof FormInvalidError) {
      req.session.status = {type: 'Failure', mes: '入力された値が間違っています。入力し直してください。', error: e};
      logger.error(e.message);
    } else if (e instanceof InvalidAccessError) {
      req.session.status = {type: 'Failure', mes: '現在のidもしくはパスワードが間違っています。入力し直してください。', error: e};
      logger.error(e.message);
    } else {
      req.session.status = {type: 'Failure', mes: '更新に失敗しました。', error: e};

      if (e instanceof InfrastructureError) logger.error(e.message);
      else logger.error('Failed to change id and pw.');
    }

    res.redirect('/admin/setting/');
  }
});

export default settingRouter;
