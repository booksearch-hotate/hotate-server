import {Request, Response, Router} from "express";

// eslint-disable-next-line new-cap
const privacyRouter = Router();

privacyRouter.get("/", (req: Request, res: Response) => {
  res.pageData.headTitle = "Privacy";

  res.render("pages/privacy", {pageData: res.pageData});
});

export default privacyRouter;
