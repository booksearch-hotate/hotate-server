import Book from "../../../domain/model/book/book";
import BookId from "../../../domain/model/book/bookId";
import PaginationMargin from "../../../domain/model/pagination/paginationMargin";
import {IBookESRepository} from "../../../domain/repository/es/IBookESRepository";
import {IEsBook} from "../documents/IEsBook";
import EsSearchBook from "../esBook";

export default class BookESRepository implements IBookESRepository {
  private readonly esBook: EsSearchBook;

  public constructor(esBook: EsSearchBook) {
    this.esBook = esBook;
  }

  public async search(query: string, pageCount: number, reqMargin: PaginationMargin, isLike: boolean): Promise<{ ids: BookId[]; total: number; }> {
    const data = await this.esBook.searchBook(query, pageCount, reqMargin, isLike);

    return {
      ids: data.ids.map((id) => new BookId(id)),
      total: data.total,
    };
  }

  public async update(book: Book): Promise<void> {
    const data: IEsBook = {
      db_id: book.Id.Id,
      book_name: book.Name,
      book_content: book.Content,
    };

    await this.esBook.update(data);
  }

  public async save(book: Book): Promise<void> {
    const data: IEsBook = {
      db_id: book.Id.Id,
      book_name: book.Name,
      book_content: book.Content,
    };

    await this.esBook.create(data);
  }

  public async delete(book: Book): Promise<void> {
    await this.esBook.delete(book.Id.Id);
  }

  public async deleteAll(): Promise<void> {
    await this.esBook.deleteAll();
  }

  public async saveMany(books: Book[]): Promise<void> {
    this.esBook.createBulkApiFile();


    books.forEach((book) => {
      const data: IEsBook = {
        db_id: book.Id.Id,
        book_name: book.Name,
        book_content: book.Content,
      };

      this.esBook.insertBulk(data);
    });

    await this.esBook.executeBulkApi();

    this.esBook.removeBulkApiFile();
  }

  public async findByDBIds(ids: string[]): Promise<string[]> {
    return await this.esBook.getIdsByDbIds(ids);
  }

  public async deleteMany(book: string[]): Promise<void> {
    await this.esBook.deleteMany(book);
  }

  public async count(): Promise<number> {
    return await this.esBook.fetchDocumentCount();
  }

  public async getIds(pageCount: number, reqMargin: PaginationMargin): Promise<BookId[]> {
    const data = await this.esBook.getIds(pageCount, reqMargin.Margin);

    return data.map((id) => new BookId(id));
  }
}
