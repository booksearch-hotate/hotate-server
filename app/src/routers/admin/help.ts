import {Request, Response, Router} from "express";

// eslint-disable-next-line new-cap
const helpRouter = Router();

/* ヘルプ画面 */
helpRouter.get("/", async (req: Request, res: Response) => {
  res.pageData.headTitle = "ヘルプ";

  res.render("pages/admin/help/index", {pageData: res.pageData});
});

export default helpRouter;
