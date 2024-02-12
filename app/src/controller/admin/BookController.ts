import AuthorSaveInputData from "../../presentation/dto/author/save/AuthorSaveInputData";
import AuthorUpdateInputData from "../../presentation/dto/author/update/AuthorUpdateInputData";
import BookDeleteInputData from "../../presentation/dto/book/delete/BookDeleteInputData";
import BookFetchAllInputData from "../../presentation/dto/book/fetchAll/BookFetchAllInputData";
import BookFetchInputData from "../../presentation/dto/book/fetchBook/BookFetchInputData";
import BookSaveInputData from "../../presentation/dto/book/save/BookSaveInputData";
import BookUpdateInputData from "../../presentation/dto/book/update/BookUpdateInputData";
import PublisherSaveInputData from "../../presentation/dto/publisher/save/PublisherSaveInputData";
import PublisherUpdateInputData from "../../presentation/dto/publisher/update/PublisherUpdateInputData";
import DeleteAllBookResponse from "../../presentation/response/book/DeleteAllBookResponse";
import DeleteBookResponse from "../../presentation/response/book/DeleteBookResponse";
import FetchAllBookResponse from "../../presentation/response/book/FetchAllBookResponse";
import FetchBookResponse from "../../presentation/response/book/FetchBookResponse";
import SaveBookResponse from "../../presentation/response/book/SaveBookResponse";
import UpdateBookResponse from "../../presentation/response/book/UpdateBookResponse";
import DeleteNotUsedAuthorUseCase from "../../usecase/author/DeleteNotUsedAuthorUsecase";
import SaveAuthorUseCase from "../../usecase/author/SaveAuthorUsecase";
import UpdateAuthorUsecase from "../../usecase/author/UpdateAuthorUsecase";
import DeleteAllBookUseCase from "../../usecase/book/DeleteAllBookUsecase";
import DeleteBookUseCase from "../../usecase/book/DeleteBookUsecase";
import FetchAllBookUseCase from "../../usecase/book/FetchAllBookUsecase";
import FetchBookUsecase from "../../usecase/book/FetchBookUsecase";
import SaveBookUseCase from "../../usecase/book/SaveBookUsecase";
import UpdateBookUsecase from "../../usecase/book/UpdateBookUsecase";
import DeleteNotUsedPublisherUseCase from "../../usecase/publisher/DeleteNotUsedPublisherUsecase";
import SavePublisherUseCase from "../../usecase/publisher/SavePublisherUsecase";
import UpdatePublisherUsecase from "../../usecase/publisher/UpdatePublisherUsecase";

export default class BookAdminController {
  private fetchAllBookUseCase: FetchAllBookUseCase;

  private fetchBookUseCase: FetchBookUsecase;

  private updateBookUseCase: UpdateBookUsecase;
  private updateAuthorUseCase: UpdateAuthorUsecase;
  private updatePublisherUseCase: UpdatePublisherUsecase;
  private deleteNotUsedAuthorUseCase: DeleteNotUsedAuthorUseCase;
  private deleteNotUsedPublisherUseCase: DeleteNotUsedPublisherUseCase;

  private saveBookUseCase: SaveBookUseCase;
  private saveAuthorUseCase: SaveAuthorUseCase;
  private savePublisherUseCase: SavePublisherUseCase;

  private deleteBookUseCase: DeleteBookUseCase;

  private deleteAllBookUseCase: DeleteAllBookUseCase;

  public constructor(
      fetchAllBookUseCase: FetchAllBookUseCase,
      fetchBookUseCase: FetchBookUsecase,
      updateBookUseCase: UpdateBookUsecase,
      updateAuthorUseCase: UpdateAuthorUsecase,
      updatePublisherUseCase: UpdatePublisherUsecase,
      deleteNotUsedAuthorUseCase: DeleteNotUsedAuthorUseCase,
      deleteNotUsedPublisherUseCase: DeleteNotUsedPublisherUseCase,
      saveBookUseCase: SaveBookUseCase,
      saveAuthorUseCase: SaveAuthorUseCase,
      savePublisherUseCase: SavePublisherUseCase,
      deleteBookUseCase: DeleteBookUseCase,
      deleteAllBookUseCase: DeleteAllBookUseCase,
  ) {
    this.fetchAllBookUseCase = fetchAllBookUseCase;
    this.fetchBookUseCase = fetchBookUseCase;
    this.updateBookUseCase = updateBookUseCase;
    this.updateAuthorUseCase = updateAuthorUseCase;
    this.updatePublisherUseCase = updatePublisherUseCase;
    this.deleteNotUsedAuthorUseCase = deleteNotUsedAuthorUseCase;
    this.deleteNotUsedPublisherUseCase = deleteNotUsedPublisherUseCase;
    this.saveBookUseCase = saveBookUseCase;
    this.saveAuthorUseCase = saveAuthorUseCase;
    this.savePublisherUseCase = savePublisherUseCase;
    this.deleteBookUseCase = deleteBookUseCase;
    this.deleteAllBookUseCase = deleteAllBookUseCase;
  }

  public async fetchBooks(pageCount: number, fetchMargin: number): Promise<FetchAllBookResponse> {
    const response = new FetchAllBookResponse();

    try {
      const input = new BookFetchAllInputData(
          pageCount,
          fetchMargin,
      );

      const output = await this.fetchAllBookUseCase.execute(input);

      return response.success({res: output});
    } catch (e) {
      return response.error();
    }
  }

  public async editBookHome(
      bookId: string,
  ): Promise<FetchBookResponse> {
    const response = new FetchBookResponse();

    try {
      const input = new BookFetchInputData(bookId);

      const output = await this.fetchBookUseCase.execute(input);

      return response.success({book: output});
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async updateBook(
      bookId: string,
      bookName: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      authorName: string,
      publisherName: string,
  ): Promise<UpdateBookResponse> {
    const response = new UpdateBookResponse();
    try {
      const fetchBookInput = new BookFetchInputData(bookId);

      const book = await this.fetchBookUseCase.execute(fetchBookInput);

      const authorInput = new AuthorUpdateInputData(book.book.AuthorId, authorName);
      const publisherInput = new PublisherUpdateInputData(book.book.PublisherId, publisherName);

      const updatedRes = await Promise.all([
        await this.updateAuthorUseCase.execute(authorInput),
        await this.updatePublisherUseCase.execute(publisherInput),
      ]);
      const updatedAuthorId = updatedRes[0];
      const updatedPublisherId = updatedRes[1];

      const bookInput = new BookUpdateInputData(
          bookId,
          updatedAuthorId.authorId,
          updatedPublisherId.publisherId,
          bookName,
          subName,
          content,
          isbn,
          ndc,
          year,
      );

      await this.updateBookUseCase.execute(bookInput);

      await Promise.all([
        this.deleteNotUsedAuthorUseCase.execute(),
        this.deleteNotUsedPublisherUseCase.execute(),
      ]);

      return response.success();
    } catch (e) {
      return response.error(e as Error);
    }
  }

  public async saveBook(
      books: {
        bookName: string,
        subName: string | null,
        content: string | null,
        isbn: string | null,
        ndc: number | null,
        year: number | null,
        authorName: string,
        publisherName: string,
      }[],
  ): Promise<SaveBookResponse> {
    const bookIds: string[] = [];
    const response = new SaveBookResponse();

    try {
      for (const book of books) {
        const saveAuthorInput = new AuthorSaveInputData(book.authorName);
        const authorId = await this.saveAuthorUseCase.execute(saveAuthorInput);

        const savePublisherInput = new PublisherSaveInputData(book.publisherName);
        const publisherId = await this.savePublisherUseCase.execute(savePublisherInput);

        const bookInput = new BookSaveInputData(
            book.bookName,
            book.subName,
            book.content,
            book.isbn,
            book.ndc,
            book.year,
            authorId.authorId,
            publisherId.publisherId,
        );

        const bookId = await this.saveBookUseCase.execute(bookInput);

        bookIds.push(bookId.bookId);
      }

      return response.success();
    } catch (e) {
      // idsを削除する処理。多分prismaの$transactionを使う
      return response.error();
    }
  }

  public async deleteBook(
      bookId: string,
  ): Promise<DeleteBookResponse> {
    const response = new DeleteBookResponse();
    try {
      const input = new BookDeleteInputData(bookId);
      await this.deleteBookUseCase.execute(input);

      await Promise.all([
        this.deleteNotUsedAuthorUseCase.execute(),
        this.deleteNotUsedPublisherUseCase.execute(),
      ]);
      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async deleteAll(): Promise<DeleteAllBookResponse> {
    const response = new DeleteAllBookResponse();
    try {
      await this.deleteAllBookUseCase.execute();

      await Promise.all([
        this.deleteNotUsedAuthorUseCase.execute(),
        this.deleteNotUsedPublisherUseCase.execute(),
      ]);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
