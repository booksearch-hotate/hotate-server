import {Request, Response, Router} from "express";
import csurf from "csurf";
import EsSearchHistory from "../../infrastructure/elasticsearch/esSearchHistory";
import getPaginationInfo from "../../utils/getPaginationInfo";
import conversionpageCounter from "../../utils/conversionPageCounter";
import SearchHistoryAdminController from "../../controller/admin/SearchHistoryController";
import FetchAllSearchHistoryUseCase from "../../usecase/searchHistory/FetchAllSearchHistoryUsecase";
import SearchHistoryESRepository from "../../infrastructure/elasticsearch/repository/SearchHistoryESRepository";
import DeleteSearchHistoryUsecase from "../../usecase/searchHistory/DeleteSearchHistoryUsecase";

// eslint-disable-next-line new-cap
const searchHistoryRouter = Router();

const csrfProtection = csurf({cookie: false});

const searchHistoryController = new SearchHistoryAdminController(
    new FetchAllSearchHistoryUseCase(new SearchHistoryESRepository(new EsSearchHistory("search_history"))),
    new DeleteSearchHistoryUsecase(new SearchHistoryESRepository(new EsSearchHistory("search_history"))),
);

/* 検索履歴一覧画面 */
searchHistoryRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  const pageCount = conversionpageCounter(req);

  const fetchMargin = 15;

  const output = await searchHistoryController.index(pageCount, fetchMargin);

  const total = output.total;

  if (total === null) throw new Error("検索履歴の取得に失敗しました。");

  const paginationData = getPaginationInfo(pageCount, total, fetchMargin, 5);

  res.pageData.headTitle = "検索履歴";
  res.pageData.anyData = {
    searchHistory: output.searchHistory,
    paginationData,
  };

  res.pageData.csrfToken = req.csrfToken();
  res.render("pages/admin/search-history/index", {pageData: res.pageData});
});

/* 検索履歴削除 */
searchHistoryRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    await searchHistoryController.delete(id);
  } catch (e: any) {
    res.status(500).send(e.message);
  }

  res.redirect("/admin/search-history/");
});

export default searchHistoryRouter;
