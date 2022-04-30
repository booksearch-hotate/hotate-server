import { Request, Response, Router, NextFunction } from "express"
import multer from "multer"

import { IPage } from "../interfaces/IPage"

import CssPathMake from "../modules/cssPath"
import OriginMake from "../modules/origin"
import AuthModule from "../modules/admin"
import CsvData from "../modules/csvData"
import Logger from "../modules/logger"

const router = Router() // ルーティング
const upload = multer({ dest: './uploads/csv/' }) // multerの設定
const auth = new AuthModule() // adominのインスタンス化
const csvData = new CsvData() // csvのインスタンス化
const logger = new Logger('router') // loggerのインスタンス化

let pageData: IPage

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
 const authCheckMiddle = (req: Request, res: Response, next: NextFunction) => {
  if (auth.verifyToken(req.session.token as string) || req.body.id && req.body.pw) {
    next()
  } else {
    logger.info('トークンが無効です。ログインページへリダイレクトします。')
    res.redirect('/login')
  }
}

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

// uriの始まりがauthのときに認証を行う
router.use('/', authCheckMiddle)

router.get('/home', (req: Request, res: Response) => {
  pageData = {
    headTitle: '管理画面',
    path: req.url,
    cssData: new CssPathMake(['auth/home'], OriginMake(req)).make()
  }
  res.render('pages/admin/home', { pageData })
})

router.get('/csv/choice', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'CSVファイル選択',
    path: req.url,
    cssData: new CssPathMake(['auth/csv/choice'], OriginMake(req)).make()
  }
  res.render('pages/admin/csv/choice', { pageData })
})

router.get('/csv/headerChoice', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ヘッダー選択',
    path: req.url,
    cssData: new CssPathMake(['auth/csv/choice'], OriginMake(req)).make(),
    anyData: {
      csvHeader: csvData.getCsvHeaderData()
    }
  }
  res.render('pages/admin/csv/headerChoice', { pageData })
})

router.post('/csv/sendFile', upload.single('csv'), (req, res: Response) => {
  const file = req.file
  try {
    csvData.setCsvData(file)
    logger.info('CSVファイルを受信しました。')
  } catch (err) {
    logger.error('CSVファイルの受信に失敗しました。')
  }
  res.redirect('/admin/csv/headerChoice')
})

router.post('/csv/formHader', async (req: Request, res: Response) => {
  await csvData.deleteBookInfo()
  await csvData.addDB(req.body)
  logger.info('データを登録しました。')
  csvData.deleteCsvData('./uploads/csv/')
  res.redirect('/admin/home')
})

export default router
