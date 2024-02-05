import {Request, Response, Router} from 'express';
import csurf from 'csurf';

import TagService from '../../domain/model/tag/tagService';

import TagApplicationService from '../../application/tagApplicationService';

import TagRepository from '../../interface/repository/tagRepository';
import BookRepository from '../../interface/repository/bookRepository';

import EsSearchBook from '../../infrastructure/elasticsearch/esBook';

import db from '../../infrastructure/prisma/prisma';


// eslint-disable-next-line new-cap
const tagsRouter = Router();

const csrfProtection = csurf({cookie: false});

const tagApplicationService = new TagApplicationService(
    new TagRepository(db),
    new BookRepository(db, new EsSearchBook('books')),
    new TagService(new TagRepository(db)),
);

/* タグ管理画面 */
tagsRouter.get('/', csrfProtection, async (req: Request, res: Response) => {
  const tags = await tagApplicationService.findAll();

  res.pageData.headTitle = 'タグ管理';
  res.pageData.anyData = {tags};
  res.pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/index', {pageData: res.pageData});
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

  res.pageData.headTitle = 'タグ編集';
  res.pageData.anyData = {tag};
  res.pageData.csrfToken = req.csrfToken();
  res.render('pages/admin/tags/edit', {pageData: res.pageData});
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
