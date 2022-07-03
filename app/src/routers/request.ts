import {Request, Response, Router} from 'express';
import {IPage} from './datas/IPage';

// eslint-disable-next-line new-cap
const requestRouter = Router();

const pageData: IPage = {} as IPage;


requestRouter.get('/request', (req: Request, res: Response) => {
  pageData.headTitle = '本のリクエスト | HOTATE';

  res.render('pages/request', {pageData});
});

export default requestRouter;
