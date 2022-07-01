import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import {IPage} from '../datas/IPage';

// eslint-disable-next-line new-cap
const settingRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

/* タグ管理画面 */
settingRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  pageData.headTitle = '管理者設定画面';

  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/setting/index', {pageData});
});

export default settingRouter;
