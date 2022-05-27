import {IBookApplicationRepository}
  from './repository/IBookApplicationRepository';
import BookModel from '../domain/model/bookModel';
import AuthorModel from '../domain/model/authorModel';
import PublisherModel from '../domain/model/publisherModel';
import BookService from '../domain/service/bookService';
import BookData from './dto/BookData';

import {getImgLink} from '../infrastructure/api/openbd';

export default class BookApplicationService {
  private readonly bookRepository: IBookApplicationRepository;
  private readonly bookService: BookService;

  public constructor(bookRepository: IBookApplicationRepository) {
    this.bookRepository = bookRepository;
    this.bookService = new BookService();
  }

  public async createBook(
      bookName: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      authorId: string,
      authorName: string,
      publisherId: string,
      publisherName: string,
  ): Promise<void> {
    const author = new AuthorModel(authorId, authorName);
    const publisher = new PublisherModel(publisherId, publisherName);
    const book = new BookModel(
        this.bookService.createUUID(),
        bookName,
        subName,
        content,
        isbn,
        ndc,
        year,
        author,
        publisher,
    );
    await this.bookRepository.save(book);
  }

  public async deleteBooks(): Promise<void> {
    await this.bookRepository.deleteAll();
  }

  public async searchBooks(query: string): Promise<BookData[]> {
    // 検索から得られたbookModelの配列
    const books = await this.bookRepository.search(query);
    /* DTOに変換 */
    const bookDatas: BookData[] = [];
    for (const book of books) {
      const bookData = new BookData(book);
      bookData.ImgLink = await getImgLink(book.Isbn); // 画像のURLを取得
      bookDatas.push(bookData);
    }

    return bookDatas;
  }

  public async searchBookById(id: string): Promise<BookData> {
    const book = await this.bookRepository.searchById(id);
    const bookData = new BookData(book);
    bookData.ImgLink = await getImgLink(book.Isbn); // 画像のURLを取得
    return bookData;
  }

  public async executeBulkApi(): Promise<void> {
    await this.bookRepository.executeBulkApi();
  }
}
