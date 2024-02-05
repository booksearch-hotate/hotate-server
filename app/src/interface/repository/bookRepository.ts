import {IBookRepository} from '../../domain/repository/IBookRepository';
import Book from '../../domain/model/book/book';
import Author from '../../domain/model/author/author';
import Publisher from '../../domain/model/publisher/publisher';
import Tag from '../../domain/model/tag/tag';

import EsSearchBook from '../../infrastructure/elasticsearch/esBook';
import {IEsBook} from '../../infrastructure/elasticsearch/documents/IEsBook';
import BookId from '../../domain/model/book/bookId';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';

import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import {ElasticsearchError, EsBulkApiError} from '../../presentation/error/infrastructure/elasticsearchError';
import {PrismaClient} from '@prisma/client';

export default class BookRepository implements IBookRepository {
  private readonly db: PrismaClient;
  private readonly esSearchBook: EsSearchBook;

  public constructor(db: PrismaClient, EsSearchBook: EsSearchBook) {
    this.db = db;
    this.esSearchBook = EsSearchBook;
  }

  public async save(book: Book): Promise<void> {
    try {
      await this.db.books.create({
        data: {
          id: book.Id,
          book_name: book.Name,
          book_sub_name: book.SubName,
          book_content: book.Content,
          isbn: book.Isbn,
          ndc: book.Ndc,
          year: Number(book.Year), // 強制的に数値に変換
          author_id: book.Author.Id,
          publisher_id: book.Publisher.Id,
        },
      });
    } catch (e) {
      console.error(e);
      throw new MySQLDBError(`Failed to add book to mysql. id:${book.Id}`);
    }

    try {
      const doc: IEsBook = {
        db_id: book.Id,
        book_name: book.Name,
        book_content: book.Content,
      };
      this.esSearchBook.insertBulk(doc);
    } catch (e) {
      throw new ElasticsearchError(`Registration to bulk api failed during generation of bulk api to add to elasticsearch. id:${book.Id}`);
    }
  }

  public async deleteAll(): Promise<void> {
    const deletes = [this.db.books.deleteMany({where: {}}), this.esSearchBook.initIndex()];
    await Promise.all(deletes);
    await this.esSearchBook.initIndex(false);
  }

  public async search(query: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}> {
    const searchResult = await this.esSearchBook.searchBooks(query, pageCount, margin); // 検索にヒットしたidの配列

    const bookIds = searchResult.ids;

    const count = searchResult.total;

    // bookIdsからbooksを取得する
    const books = await this.db.books.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
    });

    const bookModels: Book[] = [];

    for (const fetchBook of books) {
      const authorId = fetchBook.author_id;
      const publisherId = fetchBook.publisher_id;

      const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(fetchBook.id);

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      const bookModel = new Book(
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

  public async searchById(id: BookId): Promise<Book> {
    const book = await this.db.books.findFirst({where: {id: id.Id}});
    if (!book) throw new MySQLDBError('book not found');

    const authorId = book.author_id;
    const publisherId = book.publisher_id;

    const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
    const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得

    const tags = await this.getTagsByBookId(book.id);

    if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

    const authorModel = new Author(author.id, author.name);
    const publisherModel = new Publisher(publisher.id, publisher.name);

    const bookModel = new Book(
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

  public async searchByForeignId(foreignModel: Author[] | Publisher[], pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}> {
    if (foreignModel.length === 0) return {books: [], count: 0};

    let books: any[] | null = [];

    let count = 0;

    const FETCH_COUNT = margin.Margin;

    if (foreignModel[0] instanceof Author) {
      books = await this.db.books.findMany({
        where: {
          author_id: {
            in: foreignModel.map((item) => item.Id),
          },
        },
        take: FETCH_COUNT,
        skip: pageCount * FETCH_COUNT,
      });

      count = await this.db.books.count({
        where: {
          author_id: {
            in: foreignModel.map((item) => item.Id),
          },
        },
      });
    } else if (foreignModel[0] instanceof Publisher) {
      books = await this.db.books.findMany({
        where: {
          publisher_id: {
            in: foreignModel.map((item) => item.Id),
          },
        },
        take: FETCH_COUNT,
        skip: pageCount * FETCH_COUNT,
      });

      count = await this.db.books.count({
        where: {
          publisher_id: {
            in: foreignModel.map((item) => item.Id),
          },
        },
      });
    }

    if (books === null) return {books: [], count: 0};

    const res = books.map(async (column) => {
      const author = await this.db.authors.findFirst({where: {id: column.author_id}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: column.publisher_id}}); // publisherを取得

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      const tags = await this.getTagsByBookId(column.id);

      return new Book(
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
  public async searchUsingLike(word: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}> {
    // book_nameのLIKE検索
    const searchResult = await this.esSearchBook.searchUsingLike(word, pageCount, margin); // 検索にヒットしたidの配列

    const bookIds = searchResult.ids;
    const count = searchResult.total;

    // bookIdsからbooksを取得する
    const books = await this.db.books.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
    });

    const bookModels = books.map(async (book) => {
      const authorId = book.author_id;
      const publisherId = book.publisher_id;

      const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(book.id);

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      return new Book(
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
    });

    return {books: await Promise.all(bookModels), count};
  }

  public async executeBulkApi(): Promise<void> {
    try {
      await this.esSearchBook.executeBulkApi();

      this.esSearchBook.removeBulkApiFile();
    } catch (e) {
      if (e instanceof EsBulkApiError) {
        this.esSearchBook.removeBulkApiFile();
      }

      throw e;
    }
  }

  private async getTagsByBookId(bookId: string): Promise<Tag[]> {
    const tags = await this.db.books.findFirst({where: {id: bookId}}).using_tags();
    const tagModels: Tag[] = [];
    if (!tags) return [];
    for (const tag of tags) {
      const tagByDb = await this.db.tags.findFirst({where: {id: tag.tag_id}});
      if (!tagByDb) throw new MySQLDBError('tag not found');
      const tagModel = new Tag(tagByDb.id, tagByDb.name, tagByDb.created_at, []);
      tagModels.push(tagModel);
    }
    return tagModels;
  }

  public async searchByTag(tagName: string, pageCount: number, margin: PaginationMargin): Promise<{books: Book[], count: number}> {
    const FETCH_COUNT = margin.Margin;

    const tag = await this.db.tags.findFirst({
      where: {name: tagName},
    });

    if (!tag) return {books: [], count: 0};

    const tagIds = await this.db.using_tags.findMany({
      where: {tag_id: tag.id},
      take: FETCH_COUNT,
      skip: pageCount * FETCH_COUNT,
    });

    const count = await this.db.using_tags.count({where: {tag_id: tag.id}});

    const bookModels = tagIds.map(async (column) => {
      const book = await this.db.books.findFirst({where: {id: column.book_id}});

      if (!book) throw new MySQLDBError('book not found');

      const authorId = book.author_id;
      const publisherId = book.publisher_id;

      const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(column.book_id);

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      return new Book(
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
    });
    return {books: await Promise.all(bookModels), count};
  }

  public async update(book: Book): Promise<void> {
    await this.db.books.update({
      where: {id: book.Id},
      data: {
        book_name: book.Name,
        book_sub_name: book.SubName,
        book_content: book.Content,
        isbn: book.Isbn,
        ndc: book.Ndc,
        year: book.Year,
        author_id: book.Author.Id,
        publisher_id: book.Publisher.Id,
      },
    });

    const doc: IEsBook = {
      db_id: book.Id,
      book_name: book.Name,
      book_content: book.Content,
    };
    this.esSearchBook.update(doc);
  }

  public async findAll(pageCount: number, margin: PaginationMargin): Promise<Book[]> {
    const FETCH_DATA_NUM = margin.Margin;

    const books = await this.db.books.findMany({
      take: FETCH_DATA_NUM,
      skip: pageCount * FETCH_DATA_NUM,
      orderBy: {updatedAt: 'desc'},
    });

    const bookModels: Book[] = [];

    for (const book of books) {
      const authorId = book.author_id;
      const publisherId = book.publisher_id;

      const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得

      const tags = await this.getTagsByBookId(book.id);

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      const bookModel = new Book(
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
    return await this.db.books.count();
  }

  public async deleteBook(book: Book): Promise<void> {
    try {
      await this.db.books.delete({where: {id: book.Id}});
    } catch (e) {
      throw new MySQLDBError('An error occurred while deleting the book');
    }

    try {
      await this.esSearchBook.delete(book.Id);
    } catch (e) {
      await this.db.books.create({
        data: {
          id: book.Id,
          book_name: book.Name,
          book_sub_name: book.SubName,
          book_content: book.Content,
          isbn: book.Isbn,
          ndc: book.Ndc,
          year: book.Year,
          author_id: book.Author.Id,
          publisher_id: book.Publisher.Id,
        },
      });
      throw new ElasticsearchError('An error occurred while deleting the book');
    }
  }

  /**
   * 重複している本の書名を取得
   */
  public async getDuplicationBooks(): Promise<string[]> {
    const books = await this.db.books.groupBy({
      by: ['book_name'],
      having: {
        book_name: {
          _count: {
            gte: 2,
          },
        },
      },
    });

    return books.map((data) => {
      return data.book_name;
    });
  }

  /**
   * DBのidがesのidに含まれているかチェックをし、含まれていない場合そのidを返す関数
   * @returns esのidと等しくないdbのidリスト
   */
  public async checkEqualDbAndEs(): Promise<string[]> {
    const MARGIN = 500; // 一度に取得するカラム数

    const bookCount = await this.db.books.count();

    const notEqualIdList = [];

    for (let i = 0; i < Math.ceil(bookCount / MARGIN); i++) {
      const books = await this.db.books.findMany({
        select: {id: true},
        take: MARGIN,
        skip: MARGIN * i,
      });

      const ids = books.map((data) => data.id);

      const esIds = await this.esSearchBook.getIdsByDbIds(ids);

      for (let i = 0; i < ids.length; i++) {
        if (esIds.indexOf(ids[i]) === -1) notEqualIdList.push(ids[i]);
      }
    }

    return notEqualIdList;
  }

  public async checkEqualEsAndDb(): Promise<string[]> {
    const MARGIN = 500;
    const bookCount = await this.esSearchBook.fetchDocumentCount();

    const notEqualIdList = [];

    for (let i = 0; i < Math.ceil(bookCount / MARGIN); i++) {
      const ids = await this.esSearchBook.getIds(i, MARGIN);

      const dbIds = await this.db.books.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {id: true},
      }).then((fetchData) => fetchData.map((column) => column.id));

      for (let i = 0; i < ids.length; i++) {
        if (dbIds.indexOf(ids[i]) === -1) notEqualIdList.push(ids[i]);
      }
    }

    return notEqualIdList;
  }

  public async addBooksToEs(ids: BookId[]): Promise<void> {
    const fetchBooks = await this.db.books.findMany({
      where: {
        id: {
          in: ids.map((id) => id.Id),
        },
      },
    });
    const bookModels = fetchBooks.map(async (book) => {
      const authorId = book.author_id;
      const publisherId = book.publisher_id;

      const author = await this.db.authors.findFirst({where: {id: authorId}}); // authorを取得
      const publisher = await this.db.publishers.findFirst({where: {id: publisherId}}); // publisherを取得
      const tags = await this.getTagsByBookId(book.id);

      if (!(author && publisher)) throw new MySQLDBError('author or publisher not found');

      const authorModel = new Author(author.id, author.name);
      const publisherModel = new Publisher(publisher.id, publisher.name);

      return new Book(
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
    });

    const books = await Promise.all(bookModels);

    try {
      this.esSearchBook.createBulkApiFile();

      const docs: IEsBook[] = books.map((book) => {
        return {
          db_id: book.Id,
          book_name: book.Name,
          book_content: book.Content,
        };
      });

      docs.forEach((doc) => {
        this.esSearchBook.insertBulk(doc);
      });

      await this.esSearchBook.executeBulkApi();

      console.log('bulk api executed');
    } catch (e) {
      throw new ElasticsearchError('An error occurred while adding books to elasticsearch');
    } finally {
      this.esSearchBook.removeBulkApiFile();
    }
  }

  public async deleteBooksToEs(ids: BookId[]): Promise<void> {
    try {
      await this.esSearchBook.removeByDBIds(ids.map((id) => id.Id));
    } catch (e) {
      console.error(e);
      throw new ElasticsearchError('An error occurred while deleting books from elasticsearch');
    }
  }
}
