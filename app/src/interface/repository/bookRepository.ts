import Book from '../../infrastructure/db/tables/books'; // ここのBookはドメインオブジェクトではない！
import Author from '../../infrastructure/db/tables/authors';
import Publisher from '../../infrastructure/db/tables/publishers';
import UsingTag from '../../infrastructure/db/tables/usingTags';
import Tag from '../../infrastructure/db/tables/tags';

import {IBookRepository} from '../../domain/model/book/IBookRepository';
import BookModel from '../../domain/model/book/bookModel';
import AuthorModel from '../../domain/model/author/authorModel';
import PublisherModel from '../../domain/model/publisher/publisherModel';
import TagModel from '../../domain/model/tag/tagModel';

import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import {IEsBook} from '../../infrastructure/elasticsearch/documents/IEsBook';

/* Sequelizeを想定 */
interface sequelize {
  Book: typeof Book
  Author: typeof Author
  Publisher: typeof Publisher
  UsingTag: typeof UsingTag
  Tag: typeof Tag
}

export default class BookRepository implements IBookRepository {
  private readonly db: sequelize;
  private readonly esSearchBook: EsSearchBook;

  public constructor(db: sequelize, EsSearchBook: EsSearchBook) {
    this.db = db;
    this.esSearchBook = EsSearchBook;
  }

  public async save(book: BookModel): Promise<void> {
    await this.db.Book.create({
      id: book.Id,
      book_name: book.Name,
      book_sub_name: book.SubName,
      book_content: book.Content,
      isbn: book.Isbn,
      ndc: book.Ndc,
      year: book.Year,
      author_id: book.Author.Id,
      publisher_id: book.Publisher.Id,
    });

    const doc: IEsBook = {
      db_id: book.Id,
      book_name: book.Name,
      book_content: book.Content,
    };
    this.esSearchBook.insertBulk(doc);
  }

  public async deleteAll(): Promise<void> {
    const deletes = [this.db.Book.destroy({where: {}}), this.esSearchBook.initIndex()];
    await Promise.all(deletes);
  }

  public async search(query: string, pageCount: number): Promise<BookModel[]> {
    const bookIds = await this.esSearchBook.searchBooks(query, pageCount); // 検索にヒットしたidの配列
    // bookIdsからbooksを取得する
    const books = await this.db.Book.findAll({where: {id: bookIds}});

    const bookModels: BookModel[] = [];

    for (const fetchBook of books) {
      const authorId = fetchBook.author_id;
      const publisherId = fetchBook.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found');

      const authorModel = new AuthorModel(author.id, author.name);
      const publisherModel = new PublisherModel(publisher.id, publisher.name);

      const bookModel = new BookModel(
          fetchBook.id,
          fetchBook.book_name,
          fetchBook.book_sub_name,
          fetchBook.book_content,
          fetchBook.isbn,
          fetchBook.ndc,
          fetchBook.year,
          authorModel,
          publisherModel,
      );
      bookModels.push(bookModel);
    }
    return bookModels;
  }

  public async searchById(id: string): Promise<BookModel> {
    const book = await this.db.Book.findOne({where: {id: id}});
    if (!book) throw new Error('book not found');

    const authorId = book.author_id;
    const publisherId = book.publisher_id;

    const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
    const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

    if (!(author && publisher)) throw new Error('author or publisher not found');

    const authorModel = new AuthorModel(author.id, author.name);
    const publisherModel = new PublisherModel(publisher.id, publisher.name);

    const bookModel = new BookModel(
        book.id,
        book.book_name,
        book.book_sub_name,
        book.book_content,
        book.isbn,
        book.ndc,
        book.year,
        authorModel,
        publisherModel,
    );
    return bookModel;
  }

  /**
   * LIKE検索を用いてelasticsearchで検索を行う
   * @param word 検索対象
   * @param pageCount ページ数
   */
  public async searchUsingLike(word: string, pageCount: number): Promise<BookModel[]> {
    // book_nameのLIKE検索
    const bookIds = await this.esSearchBook.searchUsingLike(word, pageCount); // 検索にヒットしたidの配列
    // bookIdsからbooksを取得する
    const books = await this.db.Book.findAll({where: {id: bookIds}});

    const bookModels: BookModel[] = [];

    for (const book of books) {
      const bookByDb = await this.db.Book.findOne({where: {id: book.id}});
      if (!bookByDb) throw new Error('book not found');

      const authorId = bookByDb.author_id;
      const publisherId = bookByDb.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found');

      const authorModel = new AuthorModel(author.id, author.name);
      const publisherModel = new PublisherModel(publisher.id, publisher.name);

      const bookModel = new BookModel(
          bookByDb.id,
          bookByDb.book_name,
          bookByDb.book_sub_name,
          bookByDb.book_content,
          bookByDb.isbn,
          bookByDb.ndc,
          bookByDb.year,
          authorModel,
          publisherModel,
      );
      bookModels.push(bookModel);
    }

    return bookModels;
  }

  public async executeBulkApi(): Promise<void> {
    await this.esSearchBook.executeBulkApi();
  }

  public async getTagsByBookId(bookId: string): Promise<TagModel[]> {
    const tags = await this.db.UsingTag.findAll({where: {book_id: bookId}});
    const tagModels: TagModel[] = [];
    for (const tag of tags) {
      const tagByDb = await this.db.Tag.findOne({where: {id: tag.tag_id}});
      if (!tagByDb) throw new Error('tag not found');
      const tagModel = new TagModel(tagByDb.id, tagByDb.name, tagByDb.created_at);
      tagModels.push(tagModel);
    }
    return tagModels;
  }

  public async searchByTag(tagName: string, pageCount: number): Promise<BookModel[]> {
    const tag = await this.db.Tag.findOne({
      where: {name: tagName},
      limit: 10,
      offset: pageCount * 10,
    });
    if (!tag) return [];

    const books = await this.db.UsingTag.findAll({where: {tag_id: tag.id}});
    const bookModels: BookModel[] = [];

    for (const book of books) {
      const bookByDb = await this.db.Book.findOne({where: {id: book.book_id}});
      if (!bookByDb) throw new Error('book not found');

      const authorId = bookByDb.author_id;
      const publisherId = bookByDb.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found');

      const authorModel = new AuthorModel(author.id, author.name);
      const publisherModel = new PublisherModel(publisher.id, publisher.name);

      const bookModel = new BookModel(
          bookByDb.id,
          bookByDb.book_name,
          bookByDb.book_sub_name,
          bookByDb.book_content,
          bookByDb.isbn,
          bookByDb.ndc,
          bookByDb.year,
          authorModel,
          publisherModel,
      );
      bookModels.push(bookModel);
    }
    return bookModels;
  }

  public async getCountUsingTag(tagName: string): Promise<number> {
    const tag = await this.db.Tag.findOne({where: {name: tagName}});
    if (tag === null) return 0;

    const books = await this.db.UsingTag.findAll({where: {tag_id: tag.id}});
    return books.length;
  }

  public latestEsTotalCount(): number {
    return this.esSearchBook.Total;
  }

  public async update(book: BookModel): Promise<void> {
    await this.db.Book.update({
      book_name: book.Name,
      book_sub_name: book.SubName,
      book_content: book.Content,
      isbn: book.Isbn,
      ndc: book.Ndc,
      year: book.Year,
      author_id: book.Author.Id,
      publisher_id: book.Publisher.Id,
    }, {where: {id: book.Id}});

    const doc: IEsBook = {
      db_id: book.Id,
      book_name: book.Name,
      book_content: book.Content,
    };
    this.esSearchBook.update(doc);
  }

  public async findAll(pageCount: number): Promise<BookModel[]> {
    const FETCH_DATA_NUM = 20;
    const books = await this.db.Book.findAll({
      limit: FETCH_DATA_NUM,
      offset: pageCount * FETCH_DATA_NUM,
    });

    const bookModels: BookModel[] = [];

    for (const book of books) {
      const authorId = book.author_id;
      const publisherId = book.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found');

      const authorModel = new AuthorModel(author.id, author.name);
      const publisherModel = new PublisherModel(publisher.id, publisher.name);

      const bookModel = new BookModel(
          book.id,
          book.book_name,
          book.book_sub_name,
          book.book_content,
          book.isbn,
          book.ndc,
          book.year,
          authorModel,
          publisherModel,
      );
      bookModels.push(bookModel);
    }
    return bookModels;
  }

  public async findAllCount(): Promise<number> {
    return await this.db.Book.count();
  }

  public async deleteBook(id: string): Promise<void> {
    const list = [
      this.db.Book.destroy({where: {id}}),
      this.esSearchBook.delete(id),
    ];
    await Promise.all(list);
  }
}
