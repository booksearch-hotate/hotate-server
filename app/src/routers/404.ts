import {Request, Response, Router} from 'express';

// eslint-disable-next-line new-cap
const notFoundRouter = Router();

notFoundRouter.use((req: Request, res: Response) => {
  res.status(404);
  res.pageData.headTitle = 'ページが見つかりませんでした';

  res.render('pages/404', {pageData: res.pageData});
});

export default notFoundRouter;
