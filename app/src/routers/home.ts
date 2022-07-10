import {Request, Response, Router} from 'express';

import {IPage} from './datas/IPage';

// eslint-disable-next-line new-cap
const homeRouter = Router();

const pageData: IPage = {} as IPage;

homeRouter.get('/', (req: Request, res: Response) => {
  pageData.headTitle = 'ホーム | HOTATE';

  res.render('pages/index', {pageData});
});

export default homeRouter;
