import { Request, Response, Router, NextFunction } from "express"
import multer from "multer"

import { IPage } from "../interfaces/IPage"

import CssPathMake from "../modules/cssPath"
import OriginMake from "../modules/origin"
import AuthModule from "../modules/admin"
import Logger from "../modules/logger"

import BookApplicationService from "../application/BookApplicationService"
import AuthorApplicationService from "../application/AuthorApplicationService"
import PublisherApplicationService from "../application/PublisherApplicationService"

import BookRepository from "../interface/repository/BookRepository"
import AuthorRepository from "../interface/repository/AuthorRepository"
import PublisherRepository from "../interface/repository/PublisherRepository"

import CsvFile from "../infrastructure/fileAccessor/csvFile"

import db from "../infrastructure/db"
import Elasticsearch from "../infrastructure/elasticsearch"

const router = Router() // ルーティング
const upload = multer({ dest: './uploads/csv/' }) // multerの設定
const auth = new AuthModule() // adominのインスタンス化
const logger = new Logger('router') // loggerのインスタンス化
const csvFile = new CsvFile()
const bookApplicationService = new BookApplicationService(new BookRepository(db, new Elasticsearch('books')))
const authorApplicationService = new AuthorApplicationService(new AuthorRepository(db, new Elasticsearch('authors')))
const publisherApplicationService = new PublisherApplicationService(new PublisherRepository(db, new Elasticsearch('publishers')))

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
  if (auth.isAlreadyLogin(req.session.token)) return res.redirect('/admin/home')
  pageData = {
    headTitle: 'ログイン | HOTATE',
    path: req.url,
    cssData: new CssPathMake(['login'], OriginMake(req)).make(),
    anyData: { loginStatus: auth.loginStatus }
  }
  return res.render('pages/login', { pageData })
})

/**
 * トークンの有効性を確認する関数。
 * トークンが有効でない場合はログイン画面にリダイレクトする。
 */
 const authCheckMiddle = (req: Request, res: Response, next: NextFunction) => {
  if (auth.verifyToken(req.session.token) || req.body.id && req.body.pw) {
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
router.use('/admin', authCheckMiddle)

router.get('/admin/home', (req: Request, res: Response) => {
  pageData = {
    headTitle: '管理画面',
    path: req.url,
    cssData: new CssPathMake(['auth/home'], OriginMake(req)).make()
  }
  res.render('pages/admin/home', { pageData })
})

router.get('/admin/csv/choice', (req: Request, res: Response) => {
  pageData = {
    headTitle: 'CSVファイル選択',
    path: req.url,
    cssData: new CssPathMake(['auth/csv/choice'], OriginMake(req)).make()
  }
  res.render('pages/admin/csv/choice', { pageData })
})

router.get('/admin/csv/headerChoice', async (req: Request, res: Response) => {
  pageData = {
    headTitle: 'ヘッダー選択',
    path: req.url,
    cssData: new CssPathMake(['auth/csv/choice'], OriginMake(req)).make(),
    anyData: {
      csvHeader: await csvFile.getHeaderNames()
    }
  }
  res.render('pages/admin/csv/headerChoice', { pageData })
})

router.post('/admin/csv/sendFile', upload.single('csv'), async (req, res: Response) => {
  const file = req.file
  try {
    csvFile.File = file
    logger.info('CSVファイルを受信しました。')
  } catch (err) {
    logger.error('CSVファイルの受信に失敗しました。')
  }
  res.redirect('/admin/csv/headerChoice')
})

router.post('/admin/csv/formHader', async (req: Request, res: Response) => {
  const csv = await csvFile.getFileContent()
  await bookApplicationService.deleteBooks()
  await publisherApplicationService.deletePublishers()
  await authorApplicationService.deleteAuthors()
  for (const row of csv) {
    const authorName = row[req.body.authorName]
    const publisherName = row[req.body.publisherName]
    const authorId = await authorApplicationService.createAuthor(authorName)
    const publisherId = await publisherApplicationService.createPublisher(publisherName)
    await bookApplicationService.createBook(
      row[req.body.bookName],
      row[req.body.bookSubName],
      row[req.body.bookContent],
      row[req.body.isbn],
      row[req.body.ndc],
      row[req.body.year],
      authorId,
      authorName,
      publisherId,
      publisherName
    )
  }
  csvFile.deleteFiles()
  res.redirect('/admin/home')
})

export default router
