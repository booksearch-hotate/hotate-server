import {IBookApplicationRepository}
  from './repository/IBookApplicationRepository';

import BookModel from '../domain/model/bookModel';
import AuthorModel from '../domain/model/authorModel';
import PublisherModel from '../domain/model/publisherModel';
import BookService from '../domain/service/bookService';
import BookData from './dto/BookData';

import searchMode from '../routers/datas/searchModeType';

import {getImgLink} from '../infrastructure/api/openbd';

export default class BookApplicationService {
  private readonly bookRepository: IBookApplicationRepository;
  private readonly bookService: BookService;

  public constructor(bookRepository: IBookApplicationRepository, bookService: BookService) {
    this.bookRepository = bookRepository;
    this.bookService = bookService;
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

  public async searchBooks(
      query: string,
      searchMode: searchMode,
      pageCount: number,
  ): Promise<BookData[]> {
    // 検索から得られたbookModelの配列
    let books: BookModel[] = [];
    if (searchMode === 'tag') {
      try {
        books = await this.bookRepository.searchByTag(query, pageCount);
      } catch (e) {
        books = [];
      }
    } else {
      books = searchMode === 'strict' ? await this.bookRepository.searchUsingLike(query, pageCount) : await this.bookRepository.search(query, pageCount);
    }
    /* DTOに変換 */
    const bookDatas: BookData[] = [];

    for (const book of books) {
      const sliceStrLengh = 50; // 紹介文を区切る文字数
      if (book.Content !== null && book.Content.length > sliceStrLengh) book.Content = `${book.Content.substring(0, sliceStrLengh)}...`;

      const tags = await this.bookRepository.getTagsByBookId(book.Id);

      const bookData = new BookData(book, tags);
      bookDatas.push(bookData);
    }

    return bookDatas;
  }

  public async searchBookById(id: string): Promise<BookData> {
    const book = await this.bookRepository.searchById(id);

    const tags = await this.bookRepository.getTagsByBookId(book.Id);

    const bookData = new BookData(book, tags);

    bookData.ImgLink = await getImgLink(book.Isbn); // 画像のURLを取得

    return bookData;
  }

  public async getImgLink(isbn: string): Promise<string | null> {
    return await getImgLink(isbn);
  }

  public async executeBulkApi(): Promise<void> {
    await this.bookRepository.executeBulkApi();
  }

  public async getTotalResults(searchWords: string, searchMode: searchMode): Promise<number> {
    if (searchMode === 'strict') return await this.bookRepository.getCountUsingLike(searchWords);

    if (searchMode === 'tag') return await this.bookRepository.getCountUsingTag(searchWords);

    return this.bookRepository.latestEsTotalCount();
  }

  public async update(
      id: string,
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
  ) {
    const author = new AuthorModel(authorId, authorName);
    const publisher = new PublisherModel(publisherId, publisherName);
    const book = new BookModel(
        id,
        bookName,
        subName,
        content,
        isbn,
        ndc,
        year,
        author,
        publisher,
    );
    await this.bookRepository.update(book);
  }

  public async findAll(pageCount: number): Promise<BookData[]> {
    const books = await this.bookRepository.findAll(pageCount);
    const bookDatas: BookData[] = [];
    for (const book of books) {
      const tags = await this.bookRepository.getTagsByBookId(book.Id);

      const bookData = new BookData(book, tags);
      bookDatas.push(bookData);
    }
    return bookDatas;
  }

  public async findAllCount(): Promise<number> {
    return await this.bookRepository.findAllCount();
  }

  public async deleteBook(id: string): Promise<void> {
    await this.bookRepository.deleteBook(id);
  }
}
