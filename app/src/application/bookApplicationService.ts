import {IBookApplicationRepository}
  from './repository/IBookApplicationRepository';

import BookModel from '../domain/model/bookModel';
import AuthorModel from '../domain/model/authorModel';
import PublisherModel from '../domain/model/publisherModel';
import BookService from '../domain/service/bookService';
import BookData from './dto/bookData';

import searchMode from '../routers/datas/searchModeType';

import {getImgLink} from '../infrastructure/api/openbd';

import Logger from '../infrastructure/logger/logger';

const logger = new Logger('bookApplicationService');

export default class BookApplicationService {
  private readonly bookRepository: IBookApplicationRepository;
  private readonly bookService: BookService;

  public constructor(bookRepository: IBookApplicationRepository, bookService: BookService) {
    this.bookRepository = bookRepository;
    this.bookService = bookService;
  }

  /**
   * 本を新規に登録します。
   *
   * @param bookName 題名
   * @param subName 副題
   * @param content 内容紹介
   * @param isbn ISBN
   * @param ndc 日本十進分類法
   * @param year 出版年
   * @param authorId 著者ID
   * @param authorName 著者名
   * @param publisherId 出版社ID
   * @param publisherName 出版社名
   */
  public async createBook(
      bookName: string,
      subName: string | undefined,
      content: string | undefined,
      isbn: string | undefined,
      ndc: number | undefined,
      year: number | undefined,
      authorId: string,
      authorName: string,
      publisherId: string,
      publisherName: string,
  ): Promise<void> {
    const author = new AuthorModel(authorId, authorName);
    const publisher = new PublisherModel(publisherId, publisherName);
    try {
      const book = new BookModel(
          this.bookService.createUUID(),
          bookName,
          subName === undefined ? null : subName,
          content === undefined ? null : content,
          isbn === undefined ? null : isbn,
          ndc === undefined ? null : ndc,
          year === undefined ? null : year,
          author,
          publisher,
      );
      await this.bookRepository.save(book);
    } catch (e: any) {
      logger.error(e);
    }
  }

  /**
   * 本データを**全て**削除します。
   */
  public async deleteBooks(): Promise<void> {
    await this.bookRepository.deleteAll();
  }

  /**
   * 検索モードに対応した検索ワードから本を検索し、取得します。ページ数に対応して適切なデータを取得します。
   *
   * @param query 検索ワード
   * @param searchMode 検索モード
   * @param pageCount ページ数
   * @returns {Promise<BookData[]>} 検索にヒットした本データ
   */
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

  /**
   * 本IDから本データを取得します。
   * @param id 本ID
   * @returns 本IDに対応した本データ
   */
  public async searchBookById(id: string): Promise<BookData> {
    const book = await this.bookRepository.searchById(id);

    const tags = await this.bookRepository.getTagsByBookId(book.Id);

    const bookData = new BookData(book, tags);

    bookData.ImgLink = await getImgLink(book.Isbn); // 画像のURLを取得

    return bookData;
  }

  /**
   * [openBD](https://openbd.jp/)が提供しているAPIを用いてISBNに対応した本の画像URLを取得します。
   * @param isbn ISBN
   * @returns 画像データがあるリンク
   */
  public async getImgLink(isbn: string): Promise<string | null> {
    return await getImgLink(isbn);
  }

  /**
   * Bulkapiを実行します。
   */
  public async executeBulkApi(): Promise<void> {
    await this.bookRepository.executeBulkApi();
  }

  /**
   * 検索結果から総数を取得します。
   * @param searchWords 検索ワード
   * @param searchMode 検索のモード
   * @returns 本の総数
   */
  public async getTotalResults(searchWords: string, searchMode: searchMode): Promise<number> {
    if (searchMode === 'tag') return await this.bookRepository.getCountUsingTag(searchWords);

    return this.bookRepository.latestEsTotalCount();
  }

  /**
   * 本IDに対応する本データを更新します。
   *
   * @param id 本ID
   * @param bookName 題名
   * @param subName 副題
   * @param content 内容紹介
   * @param isbn ISBN
   * @param ndc 日本十進分類法
   * @param year 出版年
   * @param authorId 著者ID
   * @param authorName 著者名
   * @param publisherId 出版社ID
   * @param publisherName 出版社名
   */
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

  /**
   * 本データを全て取得します。ページ数に合わせた適切なデータを取得します。
   * @param pageCount ページ数
   * @returns 本データ
   */
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

  /**
   * 本データの件数を取得します。
   * @returns 本データの件数
   */
  public async findAllCount(): Promise<number> {
    return await this.bookRepository.findAllCount();
  }

  /**
   * 本IDに対応した本データを削除します。
   * @param id 本ID
   */
  public async deleteBook(id: string): Promise<void> {
    await this.bookRepository.deleteBook(id);
  }
}
