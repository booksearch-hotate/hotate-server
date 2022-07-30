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
import BookIdModel from '../../domain/model/book/bookIdModel';
import PaginationMarginModel from '../../domain/model/pagination/paginationMarginModel';

import sequelize from 'sequelize';

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

  public async search(query: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}> {
    const searchResult = await this.esSearchBook.searchBooks(query, pageCount, margin); // 検索にヒットしたidの配列

    const bookIds = searchResult.ids;

    const count = searchResult.total;

    // bookIdsからbooksを取得する
    const books = await this.db.Book.findAll({where: {id: bookIds}});

    const bookModels: BookModel[] = [];

    for (const fetchBook of books) {
      const authorId = fetchBook.author_id;
      const publisherId = fetchBook.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(fetchBook.id);

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
          tags,
      );
      bookModels.push(bookModel);
    }
    return {books: bookModels, count};
  }

  public async searchById(id: BookIdModel): Promise<BookModel> {
    const book = await this.db.Book.findOne({where: {id: id.Id}});
    if (!book) throw new Error('book not found');

    const authorId = book.author_id;
    const publisherId = book.publisher_id;

    const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
    const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得

    const tags = await this.getTagsByBookId(book.id);

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
        tags,
    );
    return bookModel;
  }

  public async searchByForeignId(foreignModel: AuthorModel[] | PublisherModel[], pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}> {
    if (foreignModel.length === 0) return {books: [], count: 0};

    let books: Book[] = [];

    let count = 0;

    const FETCH_COUNT = margin.Margin;

    if (foreignModel[0] instanceof AuthorModel) {
      books = await this.db.Book.findAll({
        where: {author_id: {[sequelize.Op.in]: foreignModel.map((item) => item.Id)}},
        limit: FETCH_COUNT,
        offset: pageCount * FETCH_COUNT,
      });

      count = await this.db.Book.count({
        where: {author_id: {[sequelize.Op.in]: foreignModel.map((item) => item.Id)}},
      });
    } else if (foreignModel[0] instanceof PublisherModel) {
      books = await this.db.Book.findAll({
        where: {publisher_id: {[sequelize.Op.in]: foreignModel.map((item) => item.Id)}},
        limit: FETCH_COUNT,
        offset: pageCount * FETCH_COUNT,
      });

      count = await this.db.Book.count({
        where: {publisher_id: {[sequelize.Op.in]: foreignModel.map((item) => item.Id)}},
      });
    }

    if (books === null) return {books: [], count: 0};

    const res = books.map(async (column) => {
      const author = await this.db.Author.findOne({where: {id: column.author_id}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: column.publisher_id}}); // publisherを取得

      if (!(author && publisher)) throw new Error('author or publisher not found');

      const authorModel = new AuthorModel(author.id, author.name);
      const publisherModel = new PublisherModel(publisher.id, publisher.name);

      const tags = await this.getTagsByBookId(column.id);

      return new BookModel(
          column.id,
          column.book_name,
          column.book_sub_name,
          column.book_content,
          column.isbn,
          column.ndc,
          column.year,
          authorModel,
          publisherModel,
          tags,
      );
    });

    return {books: await Promise.all(res), count};
  }

  /**
   * LIKE検索を用いてelasticsearchで検索を行う
   * @param word 検索対象
   * @param pageCount ページ数
   */
  public async searchUsingLike(word: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}> {
    // book_nameのLIKE検索
    const searchResult = await this.esSearchBook.searchUsingLike(word, pageCount, margin); // 検索にヒットしたidの配列

    const bookIds = searchResult.ids;
    const count = searchResult.total;

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
      const tags = await this.getTagsByBookId(book.id);

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
          tags,
      );
      bookModels.push(bookModel);
    }

    return {books: bookModels, count};
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
      const tagModel = new TagModel(tagByDb.id, tagByDb.name, tagByDb.created_at, []);
      tagModels.push(tagModel);
    }
    return tagModels;
  }

  public async searchByTag(tagName: string, pageCount: number, margin: PaginationMarginModel): Promise<{books: BookModel[], count: number}> {
    const FETCH_COUNT = margin.Margin;

    const tag = await this.db.Tag.findOne({
      where: {name: tagName},
    });

    if (!tag) return {books: [], count: 0};

    const books = await this.db.UsingTag.findAll({
      where: {tag_id: tag.id},
      limit: FETCH_COUNT,
      offset: pageCount * FETCH_COUNT,
    });

    const count = await this.db.UsingTag.count({where: {tag_id: tag.id}});
    const bookModels: BookModel[] = [];

    for (const book of books) {
      const bookByDb = await this.db.Book.findOne({where: {id: book.book_id}});
      if (!bookByDb) throw new Error('book not found');

      const authorId = bookByDb.author_id;
      const publisherId = bookByDb.publisher_id;

      const author = await this.db.Author.findOne({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.Publisher.findOne({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(book.book_id);

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
          tags,
      );
      bookModels.push(bookModel);
    }
    return {books: bookModels, count};
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

  public async findAll(pageCount: number, margin: PaginationMarginModel): Promise<BookModel[]> {
    const FETCH_DATA_NUM = margin.Margin;
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

      const tags = await this.getTagsByBookId(book.id);

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
          tags,
      );
      bookModels.push(bookModel);
    }
    return bookModels;
  }

  public async findAllCount(): Promise<number> {
    return await this.db.Book.count();
  }

  public async deleteBook(book: BookModel): Promise<void> {
    const list = [
      this.db.Book.destroy({where: {id: book.Id}}),
      this.esSearchBook.delete(book.Id),
    ];
    await Promise.all(list);
  }
}
