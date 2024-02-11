import {Request, Response, Router} from "express";
import csurf from "csurf";

import db from "../../infrastructure/prisma/prisma";
import TagAdminController from "../../controller/admin/TagController";
import FindAllTagUseCase from "../../usecase/tag/FindAllTagUsecase";
import TagPrismaRepository from "../../infrastructure/prisma/repository/TagPrismaRepository";
import DeleteTagUseCase from "../../usecase/tag/DeleteTagUsecase";
import FindByIdTagUseCase from "../../usecase/tag/FindByIdTagUsecase";
import UpdateTagUseCase from "../../usecase/tag/UpdateTagUsecase";


// eslint-disable-next-line new-cap
const tagsRouter = Router();

const csrfProtection = csurf({cookie: false});

const tagController = new TagAdminController(
    new FindAllTagUseCase(new TagPrismaRepository(db)),
    new DeleteTagUseCase(new TagPrismaRepository(db)),
    new FindByIdTagUseCase(new TagPrismaRepository(db)),
    new UpdateTagUseCase(new TagPrismaRepository(db)),
);

/* タグ管理画面 */
tagsRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  const tags = (await tagController.index()).tags;

  res.pageData.headTitle = "タグ管理";
  res.pageData.anyData = {tags};
  res.pageData.csrfToken = req.csrfToken();
  res.render("pages/admin/tags/index", {pageData: res.pageData});
});

/* タグの削除 */
tagsRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  await tagController.delete(id);

  res.redirect("/admin/tags");
});

/* タグの編集画面 */
tagsRouter.get("/edit", csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== "string") return res.redirect("/admin/tags");

  const tag = (await tagController.edit(id)).tag;

  res.pageData.headTitle = "タグ編集";
  res.pageData.anyData = {tag};
  res.pageData.csrfToken = req.csrfToken();
  res.render("pages/admin/tags/edit", {pageData: res.pageData});
});

/* タグの編集処理 */
tagsRouter.post("/update", csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const name = req.body.name;

  if (name === "") return res.redirect(`/admin/tags/edit?id=${id}`);

  await tagController.update(id, name);

  res.redirect("/admin/tags");
});

export default tagsRouter;
