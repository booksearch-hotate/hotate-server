import {Request, Response, Router} from "express";
import csurf from "csurf";
import FetchBookImgController from "../../controller/api/FetchBookImgController";
import FetchBookImgUseCase from "../../usecase/book/FetchBookImgUsecase";
import BookImgOpenDBRepository from "../../infrastructure/api/repository/BookImgOpenDBRepository";

// eslint-disable-next-line new-cap
const apiRouter = Router();

const csrfProtection = csurf({cookie: false});

const fetchBookImgController = new FetchBookImgController(
    new FetchBookImgUseCase(
        new BookImgOpenDBRepository(),
    ),
);

/* isbnに対応する画像をopenbdから取得 */
apiRouter.post("/:isbn/imgLink", csrfProtection, async (req: Request, res: Response) => {
  const isbn = req.params.isbn === "NO_ISBN" ? null : req.params.isbn;

  const imgLink = (await fetchBookImgController.fetchBookImg(isbn)).url;

  res.json({imgLink});
});

export default apiRouter;
