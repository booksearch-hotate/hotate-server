import {Request, Response, Router} from "express";
import csurf from "csurf";

import db from "../../infrastructure/prisma/prisma";
import EsSearchBook from "../../infrastructure/elasticsearch/esBook";
import EsSearchHistory from "../../infrastructure/elasticsearch/esSearchHistory";

import {IPaginationData} from "../datas/IPaginationData";

import searchMode from "../datas/searchModeType";

import getPaginationInfo from "../../utils/getPaginationInfo";
import conversionpageCounter from "../../utils/conversionPageCounter";
import EsAuthor from "../../infrastructure/elasticsearch/esAuthor";
import searchCategory from "../datas/searchCategoryType";
import EsPublisher from "../../infrastructure/elasticsearch/esPublisher";
import SearchController from "../../controller/SearchController";
import SearchHistoryUseCase from "../../usecase/searchHistory/SearchHistoryUsecase";
import SearchHistoryESRepository from "../../infrastructure/elasticsearch/repository/SearchHistoryESRepository";
import SearchBooksUsecase from "../../usecase/book/SearchBooksUsecase";
import BookPrismaRepository from "../../infrastructure/prisma/repository/BookPrismaRepository";
import BookESRepository from "../../infrastructure/elasticsearch/repository/BookESRepository";
import AuthorESRepository from "../../infrastructure/elasticsearch/repository/AuthorESRepository";
import PublisherESRepository from "../../infrastructure/elasticsearch/repository/PublisherESRepository";
import SearchHistoryData from "../../presentation/dto/searchHistory/searchHistoryData";
import BookData from "../../presentation/dto/book/BookData";
import AddSearchHistoryUseCase from "../../usecase/searchHistory/AddSearchHistoryUsecase";

// eslint-disable-next-line new-cap
const searchRouter = Router();


const csrfProtection = csurf({cookie: false});

const searchController = new SearchController(
    new SearchHistoryUseCase(
        new SearchHistoryESRepository(new EsSearchHistory("search_history")),
    ),
    new SearchBooksUsecase(
        new BookPrismaRepository(db),
        new BookESRepository(new EsSearchBook("books")),
        new AuthorESRepository(new EsAuthor("authors")),
        new PublisherESRepository(new EsPublisher("publishers")),
    ),
    new AddSearchHistoryUseCase(
        new SearchHistoryESRepository(new EsSearchHistory("search_history")),
    ),
);

/* 検索結果 */
searchRouter.get("/search", csrfProtection, async (req: Request, res: Response) => {
  const searchWord = req.query.search as string;

  try {
    const MAX_SEARCH_WORD_LENGTH = 100;
    if (typeof searchWord === "string" && searchWord.length > MAX_SEARCH_WORD_LENGTH) throw new Error("検索ワードが長すぎます");
    if (searchWord.length === 0) throw new Error("検索ワードが入力されていません");

    let searchMode: searchMode = "none";
    let searchCategory: searchCategory = "book";

    const isStrict = req.query.mode === "strict";
    const isTag = req.query.mode == "tag";
    const formSearchCategory = req.query.type;

    if (isStrict) searchMode = "strict";
    if (isTag) searchMode = "tag";
    /* タグ検索とぜったい検索が両方とも選択されている場合、両方とも無効化 */
    if (isTag && isStrict) searchMode = "none";

    if (typeof formSearchCategory !== "string") searchCategory = "book";

    if (formSearchCategory === "author") searchCategory = "author";
    else if (formSearchCategory === "publisher") searchCategory = "publisher";

    if (searchCategory !== "book" && searchMode === "tag") searchMode = "none";

    const pageCount = conversionpageCounter(req);

    let paginationData: IPaginationData = {
      pageRange: {
        min: 0,
        max: 0,
      },
      totalPage: 0,
      pageCount,
    };

    const FETCH_MARGIN = 9;

    let searchRes: BookData[] = [];
    let searchHis: SearchHistoryData[] = [];
    if (searchWord !== "") {
      const res = await searchController.search(
          searchWord,
          searchMode,
          searchCategory,
          pageCount,
          FETCH_MARGIN,
      );

      searchRes = res.searchBooksList;
      searchHis = res.searchHistoryList;

      if (res.count === null) throw new Error("検索結果が取得できませんでした");

      paginationData = getPaginationInfo(pageCount, res.count, FETCH_MARGIN, 7);
    }

    res.pageData.headTitle = "検索結果";
    res.pageData.anyData = {
      searchRes,
      searchHis,
      searchWord,
      paginationData,
      isStrict,
      isTag,
      searchCategory,
    };
    res.pageData.csrfToken = req.csrfToken();

    if (!isStrict && !isTag) searchController.addSearchHistory(searchWord);

    res.render("pages/search", {pageData: res.pageData});
  } catch (e: any) {
    req.flash("error", e.message);
    const backURL = req.header("Referer") || "/";
    res.redirect(backURL);
  }
});

export default searchRouter;
