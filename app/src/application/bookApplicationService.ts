import {IBookRepository}
  from '../domain/model/book/IBookRepository';

import Book from '../domain/model/book/book';
import Author from '../domain/model/author/author';
import Publisher from '../domain/model/publisher/publisher';
import BookService from '../domain/service/bookService';
import BookData from '../domain/model/book/bookData';

import searchMode from '../routers/datas/searchModeType';

import {getImgLink} from '../infrastructure/api/openbd';

import BookId from '../domain/model/book/bookId';
import PaginationMargin from '../domain/model/pagination/paginationMargin';
import {IAuthorRepository} from '../domain/model/author/IAuthorRepository';
import searchCategory from '../routers/datas/searchCategoryType';
import {IPublisherRepository} from '../domain/model/publisher/IPublisherRepository';

export default class BookApplicationService {
  private readonly bookRepository: IBookRepository;
  private readonly authorRepository: IAuthorRepository;
  private readonly publisherRepository: IPublisherRepository;
  private readonly bookService: BookService;

  public constructor(
      bookRepository: IBookRepository,
      authorRepository: IAuthorRepository,
      publisherRepository: IPublisherRepository,
      bookService: BookService,
  ) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
    this.publisherRepository = publisherRepository;
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
      isBulk: boolean = true,
  ): Promise<void> {
    const author = new Author(authorId, authorName);
    const publisher = new Publisher(publisherId, publisherName);
    const book = new Book(
        this.bookService.createUUID(),
        bookName,
        subName === undefined ? null : subName,
        content === undefined ? null : content,
        isbn === undefined ? null : isbn,
        ndc === undefined ? null : ndc,
        year === undefined ? null : year,
        author,
        publisher,
        [],
    );
    await this.bookRepository.save(book);

    if (isBulk === false) await this.bookRepository.executeBulkApi();
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
   * @param searchCategory 検索カテゴリ
   * @param pageCount ページ数
   * @param reqMargin 1ページあたりのデータ数
   * @returns {Promise<{books: BookData[], count: number}>} 検索にヒットした本データ(books)とヒットした合計件数(count)
   */
  public async searchBooks(
      query: string,
      searchMode: searchMode,
      searchCategory: searchCategory,
      pageCount: number,
      reqMargin: number,
  ): Promise<{books: BookData[], count: number}> {
    // 検索から得られたbookModelの配列
    let books: {books: Book[], count: number};

    const margin = new PaginationMargin(reqMargin);

    if (searchMode === 'tag' && searchCategory === 'book') {
      try {
        books = await this.bookRepository.searchByTag(query, pageCount, margin);
      } catch (e) {
        books = {books: [], count: 0};
      }
    } else {
      if (searchCategory === 'author') {
        const authorModels = searchMode === 'strict' ? await this.authorRepository.searchUsingLike(query) : await this.authorRepository.search(query);
        books = await this.bookRepository.searchByForeignId(authorModels, pageCount, margin);
      } else if (searchCategory === 'publisher') {
        const publisherModels = searchMode === 'strict' ? await this.publisherRepository.searchUsingLike(query) : await this.publisherRepository.search(query);
        books = await this.bookRepository.searchByForeignId(publisherModels, pageCount, margin);
      } else {
        books = searchMode === 'strict' ? await this.bookRepository.searchUsingLike(query, pageCount, margin) : await this.bookRepository.search(query, pageCount, margin);
      }
    }

    /* DTOに変換 */
    const bookDatas: BookData[] = [];

    for (const book of books.books) {
      const SLICE_STR_LENGTH = 50; // 紹介文を区切る文字数
      const bookContent = book.Content;
      if (bookContent !== null && bookContent.length > SLICE_STR_LENGTH) {
        book.changeContent(`${bookContent.substring(0, SLICE_STR_LENGTH)}...`);
      }

      const bookData = new BookData(book);
      bookDatas.push(bookData);
    }

    return {books: bookDatas, count: books.count};
  }

  /**
   * 本IDから本データを取得します。
   * @param id 本ID
   * @returns 本IDに対応した本データ
   */
  public async searchBookById(id: string): Promise<BookData> {
    const bookId = new BookId(id);
    const book = await this.bookRepository.searchById(bookId);

    const bookData = new BookData(book);

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
   * 本IDに対応する本データを更新します。
   *
   * @param id 本ID
   * @param bookName 題名
   * @param subName 副題
   * @param content 内容紹介
   * @param isbn ISBN
   * @param ndc 日本十進分類法
   * @param year 出版年
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
      authorName: string | null,
      publisherId: string,
      publisherName: string | null,
  ) {
    const book = await this.bookRepository.searchById(new BookId(id));

    const author = new Author(authorId, authorName);

    const publisher = new Publisher(publisherId, publisherName);

    book.changeName(bookName);
    book.changeSubName(subName);
    book.changeContent(content);
    book.changeIsbn(isbn);
    book.changeNdc(ndc);
    book.changeYear(year);
    book.changeAuthor(author);
    book.changePublisher(publisher);

    await this.bookRepository.update(book);
  }

  /**
   * 本データを全て取得します。ページ数に合わせた適切なデータを取得します。
   * @param pageCount ページ数
   * @returns 本データ
   */
  public async findAll(pageCount: number, reqMargin: number): Promise<BookData[]> {
    const margin = new PaginationMargin(reqMargin);
    const books = await this.bookRepository.findAll(pageCount, margin);
    const bookDatas: BookData[] = [];

    for (const book of books) bookDatas.push(new BookData(book));

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
    const book = await this.bookRepository.searchById(new BookId(id));

    if (book === null) return;

    await this.bookRepository.deleteBook(book);
  }

  public async checkDuplicationBooks(): Promise<string[]> {
    const bookNames = await this.bookRepository.getDuplicationBooks();

    return bookNames;
  }
}
