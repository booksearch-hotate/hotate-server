import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import TagService from '../../domain/service/tagService';

import TagApplicationService from '../../application/TagApplicationService';

import TagRepository from '../../interface/repository/TagRepository';

import db from '../../infrastructure/db';

import {IPage} from '../obj/IPage';

// eslint-disable-next-line new-cap
const tagsRouter = Router();

const pageData: IPage = {} as IPage;

const csrfProtection = csurf({cookie: false});

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new TagService(new TagRepository(db)),
);

/* タグ管理画面 */
tagsRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const tags = await tagApplicationService.findAll();

  pageData.headTitle = 'タグ管理';
  pageData.anyData = {tags};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/index', {pageData});
});

/* タグの削除 */
tagsRouter.post('/delete', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  await tagApplicationService.delete(id);

  res.redirect('/admin/tags');
});

/* タグの編集画面 */
tagsRouter.get('/edit', csrfProtection, async (req: Request, res: Response) => {
  const id = req.query.id;

  if (typeof id !== 'string') return res.redirect('/admin/tags');

  const tag = await tagApplicationService.findById(id);

  pageData.headTitle = 'タグ編集';
  pageData.anyData = {tag};
  pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/edit', {pageData});
});

/* タグの編集処理 */
tagsRouter.post('/update', csrfProtection, async (req: Request, res: Response) => {
  const id = req.body.id;
  const name = req.body.name;

  if (name === '') return res.redirect(`/admin/tags/edit?id=${id}`);

  await tagApplicationService.update(id, name);

  res.redirect('/admin/tags');
});

export default tagsRouter;
