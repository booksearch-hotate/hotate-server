import AuthorSaveManyInputData from "../../presentation/dto/author/saveMany/AuthorSaveManyInputData";
import BookSaveManyInputData from "../../presentation/dto/book/saveMany/BookSaveManyInputData";
import PublisherSaveManyInputData from "../../presentation/dto/publisher/saveMany/PublisherSaveManyInputData";
import SaveManyCsvDataResponse from "../../presentation/response/book/SaveManyCsvDataResponse";
import SaveManyAuthorsUsecase from "../../usecase/author/SaveManyAuthorsUsecase";
import SaveManyBooksUsecase from "../../usecase/book/SaveManyBooksUsecase";
import SaveManyPublisherUsecase from "../../usecase/publisher/SaveManyPublisherUsecase";

export default class CsvController {
  private readonly saveManyAuthorUsecase: SaveManyAuthorsUsecase;
  private readonly saveManyPublisherUsecase: SaveManyPublisherUsecase;
  private readonly saveManyBookUsecase: SaveManyBooksUsecase;

  public constructor(
      saveManyAuthorUsecase: SaveManyAuthorsUsecase,
      saveManyPublisherUsecase: SaveManyPublisherUsecase,
      saveManyBookUsecase: SaveManyBooksUsecase,
  ) {
    this.saveManyAuthorUsecase = saveManyAuthorUsecase;
    this.saveManyPublisherUsecase = saveManyPublisherUsecase;
    this.saveManyBookUsecase = saveManyBookUsecase;
  }

  public async saveByCsvData(data: {
      bookName: string;
      subName: string;
      content: string;
      isbn: string;
      ndc: string;
      year: string;
      authorName: string;
      publisherName: string;
  }[]): Promise<SaveManyCsvDataResponse> {
    const response = new SaveManyCsvDataResponse();

    try {
      const authorInputData = new AuthorSaveManyInputData(data.map((author) => author.authorName));

      const authors = await this.saveManyAuthorUsecase.execute(authorInputData);

      const publisherInputData = new PublisherSaveManyInputData(data.map((publisher) => publisher.publisherName));

      const publishers = await this.saveManyPublisherUsecase.execute(publisherInputData);

      if (authors.dataList.length !== data.length || publishers.dataList.length !== data.length) {
        throw new Error("Failed to save authors or publishers");
      }

      const bookInputData = new BookSaveManyInputData(data.map((book, index) => {
        return {
          bookName: book.bookName,
          subName: book.subName,
          content: book.content,
          isbn: book.isbn,
          ndc: book.ndc !== null ? Number(book.ndc) : null,
          year: book.year !== null ? Number(book.year) : null,
          authorId: authors.dataList[index].Id,
          authorName: authors.dataList[index].Name || "",
          publisherId: publishers.dataList[index].Id,
          publisherName: publishers.dataList[index].Name || "",
        };
      }));

      await this.saveManyBookUsecase.execute(bookInputData);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
