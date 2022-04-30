import express, {Application } from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import dotenv from 'dotenv'

import * as rootRouter from './routers/rootRouter'
import * as adminRouter from './routers/adminRouter'

import Logger from './modules/logger'

const app: Application = express()
const logger = new Logger('system')

dotenv.config() // envファイルの読み込み

const PORT = 8080

app.set('view engine', 'ejs') // テンプレートエンジンの設定
app.use(express.static('public')) // 静的ファイルの設定

// セッションに用いるデータの型を定義
declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    token: string
  }
}

app.use(bodyParser.urlencoded({ extended: true })) // POSTで送られてきたデータを解析する
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET as string, // トークンを署名するためのキー
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // 1時間
  }
}))

app.use('/', rootRouter.default)
app.use('/admin', adminRouter.default)

// listen
app.listen(PORT, () => { logger.info(`Server is running on ${PORT}`) })
