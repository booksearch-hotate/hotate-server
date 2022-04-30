import { Request, Response, Router } from "express"

import { IPage } from "../interfaces/IPage"

import CssPathMake from "../modules/cssPath"
import OriginMake from "../modules/origin"

const router = Router() // ルーティング

let pageData: IPage

/* ルーティング */
router.get('/', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ホーム | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['index'], OriginMake(req)).make()
  }
  res.render('pages/index', { pageData })
})

router.get('/login', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ログイン | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['login'], OriginMake(req)).make()
  }
  res.render('pages/login', { pageData })
})

export default router
