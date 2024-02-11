import BookId from "../domain/model/book/bookId";
import TagInsertInputData from "../presentation/dto/tag/insertToBook/TagInsertInputData";
import InsertTagToBookResponse from "../presentation/response/tag/InsertTagToBookResponse";
import InsertTagToBookUseCase from "../usecase/tag/InsertTagToBookUseCase";

export default class TagController {
  private readonly insertTagToBookUseCase: InsertTagToBookUseCase;

  public constructor(
      insertTagToBookUseCase: InsertTagToBookUseCase,
  ) {
    this.insertTagToBookUseCase = insertTagToBookUseCase;
  }

  public async insertTagToBook(bookId: string, tagName: string): Promise<InsertTagToBookResponse> {
    const response = new InsertTagToBookResponse();
    try {
      const input = new TagInsertInputData(new BookId(bookId), tagName);

      const output = await this.insertTagToBookUseCase.execute(input);

      return response.success(output);
    } catch (error) {
      return response.error();
    }
  }
}
