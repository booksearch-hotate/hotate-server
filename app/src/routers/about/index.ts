import {Request, Response, Router} from "express";

// eslint-disable-next-line new-cap
const aboutRouter = Router();

aboutRouter.get("/", (req: Request, res: Response) => {
  res.pageData.headTitle = "About";

  res.render("pages/about", {pageData: res.pageData});
});

export default aboutRouter;
