import express, {Application} from "express";
import expressRateLimit from "express-rate-limit";
import session from "express-session";
import dotenv from "dotenv";
import csurf from "csurf";
import colors from "colors/safe";
import path from "path";
import fs from "fs";
import glob from "glob";
import appRoot from "app-root-path";

/* routers */
import homeRouter from "../routers/home";
import searchRouter from "../routers/search";
import requestRouter from "../routers/request";
import bookRouter from "../routers/admin/book";
import adminRouter from "../routers/admin/index";
import searchHistoryRouter from "../routers/admin/searchHistory";
import csvRouter from "../routers/admin/csv";
import tagsRouter from "../routers/admin/tags";
import apiRouter from "../routers/api";
import departmentRouter from "../routers/admin/department";
import bookRequestRouter from "../routers/admin/bookRequest";
import recommendationRouter from "../routers/admin/recommendation";
import aboutRouter from "../routers/about";
import notFoundRouter from "../routers/404";
import helpRouter from "../routers/admin/help";
import healthRouter from "../routers/admin/health";
// import bookApiRouter from "../routers/api/admin/bookApi";
import bookItemRouter from "../routers/item";

import Logger from "../infrastructure/logger/logger";

import {isLocal, isUseAWSES} from "../infrastructure/cli/cmdLine";

import ElasticSearch, {getEsHost} from "../infrastructure/elasticsearch/elasticsearch";

import esDocuments from "../infrastructure/elasticsearch/documents/documentType";
import axios from "axios";
import SetPageData from "../utils/setPageData";
import campaignRouter from "../routers/campaign";

import db from "../infrastructure/prisma/prisma";

import flash from "connect-flash";
import userRouter from "../routers/user";
import userPassportSetting from "../infrastructure/auth/passport";
import bookMarkRouter from "../routers/user/bookmark";
import UserPrismaRepository from "../infrastructure/prisma/repository/UserPrismaRepository";
import recommendationApiRouter from "../routers/api/recommendation/recommendationApi";
import tagRouter from "../routers/tag";
import bookApiRouter from "../routers/api/admin/health";

const COOKIE_MAX_AGE = 60 * 60 * 1000; // 1時間

const app: Application = express();
const logger = new Logger("system");

/* 起動時に接続確認を行うドキュメント */
const elasticsearchDocuments: esDocuments[] = ["books", "authors", "publishers", "search_history"];

dotenv.config(); // envファイルの読み込み

app.set("view engine", "ejs"); // テンプレートエンジンの設定
app.use(express.static("public")); // 静的ファイルの設定

/* リクエスト回数に制限を追加 */
const limiter = expressRateLimit({
  windowMs: 60 * 1000, // 1分間に
  max: 1000, // 100回まで
});

app.use(express.urlencoded({extended: true})); // POSTで送られてきたデータを解析する
app.use(express.json());

app.use(session({ // lgtm [js/clear-text-cookie]
  secret: process.env.SESSION_SECRET as string, // トークンを署名するためのキー
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
  },
}));

app.use(limiter);

app.use(csurf({cookie: false}));

/* elasticsearchのtemplateを読み込み、適用する処理 */
const settingTemplate = async () => {
  const templatePath = `${appRoot.path}/settings/elasticsearch/templates/${isUseAWSES() && isLocal() ? "dev" : "pro"}/*.json`;

  const files = glob.sync(templatePath);

  const checkFiles = files.map(async (file) => {
    const fileName = path.basename(file, ".json");

    const hostName = getEsHost();

    const data = JSON.parse(fs.readFileSync(file, "utf8"));

    try {
      await axios.put(`${hostName}/_template/${fileName}_template`, data);
    } catch (e: any) {
      logger.error(e);
      throw e;
    }
  });

  await Promise.all(checkFiles);
};

/* elasticsearchの初期化処理 */
const settingInitEs = async () => {
  await settingTemplate();

  const esPromiseList = [];

  for (const index of elasticsearchDocuments) {
    esPromiseList.push(new ElasticSearch(index).initIndex(false));
  }

  await Promise.all(esPromiseList);
};

settingInitEs().catch((e: any) => {
  logger.fatal(e);
  logger.fatal("Initialization failed.");

  logger.fatal(`
    Elasticsearchの初期化に失敗しました。
    これにより${colors.red("検索エンジンが使えない状況")}となります。
    早急に改善してください。\n
    ↓主要な問題とその解決策↓\n
    ${colors.blue("https://github.com/booksearch-hotate/hotate-server/blob/main/DOC/resolve-problem.md")}
    `);
});

app.use(flash());

/* passportの読み込み */
userPassportSetting(app, new UserPrismaRepository(db));

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

db.school_grade_info.findFirst({}).then((data) => {
  if (data === null) {
    db.school_grade_info.create({
      data: {
        year: 3,
        school_class: 5,
      },
    }).then(() => {
      logger.info("学年情報を初期化しました。");
    });
  }
}).catch((e) => {
  logger.error(e);
  throw e;
});

app.use(SetPageData);

app.use("/", homeRouter);
app.use("/", bookItemRouter);
app.use("/", searchRouter);
app.use("/", requestRouter);
app.use("/tag", tagRouter);
app.use("/user", userRouter);
app.use("/user/bookmark", bookMarkRouter);
app.use("/campaign", campaignRouter);
app.use("/about", aboutRouter);
app.use("/admin", adminRouter);
app.use("/admin/book", bookRouter);
app.use("/admin/search-history", searchHistoryRouter);
app.use("/admin/csv", csvRouter);
app.use("/admin/tags", tagsRouter);
app.use("/admin/school-info", departmentRouter);
app.use("/admin/book-request", bookRequestRouter);
app.use("/admin/recommendation", recommendationRouter);
app.use("/admin/help", helpRouter);
app.use("/admin/health", healthRouter);
app.use("/api", apiRouter);
app.use("/api/recommendation", recommendationApiRouter);
app.use("/api/admin/health/books", bookApiRouter);

// 必ず一番最後に入れること
app.use("/", notFoundRouter);

// listen
export function startAppServer(port: number) {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    if (isLocal()) logger.debug(colors.green("現在ローカル環境で動作しています。"));
    logger.info(`サーバの起動に成功しました！\nリンク : ${colors.blue(`http://localhost:${port}`)}`);
  });
}

export {app};
