import { Request, Response, Router } from "express"

import { IPage } from "../interfaces/IPage"

import CssPathMake from "../modules/cssPath"
import OriginMake from "../modules/origin"
import Logger from "../modules/logger"
import AuthModule from "../modules/admin"

const router = Router() // ルーティング
const logger = new Logger('router') // loggerのインスタンス化
const auth = new AuthModule() // adominのインスタンス化

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

/**
 * ログイン処理を行う関数
*/
router.post('/check', (req: Request, res: Response) => {
  logger.debug('check')
  if (req.body.id && req.body.pw) {
    const id = req.body.id
    const pw = req.body.pw
    const isLogin = auth.loginFlow(id, pw)
    if (isLogin) {
      if (!req.session.token) req.session.token = auth.getToken() // トークンの格納
      res.redirect('/admin/home')
      logger.info('ログインに成功しました。')
    } else {
      res.redirect('/login')
      logger.warn('ログインに失敗しました。')
    }
  } else {
    res.redirect('/login')
    logger.warn('直接ログインしようとしました。')
  }
})

export default router
