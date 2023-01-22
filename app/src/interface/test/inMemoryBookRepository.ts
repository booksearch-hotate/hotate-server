import {Db} from 'mongodb';
import Author from '../../domain/model/author/author';
import Book from '../../domain/model/book/book';
import BookId from '../../domain/model/book/bookId';
import {IBookRepository} from '../../domain/model/book/IBookRepository';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';
import Publisher from '../../domain/model/publisher/publisher';
import Tag from '../../domain/model/tag/tag';

import {authorCollectionName, authorDocument} from '../../infrastructure/inMemory/collections/author';
import {bookCollectionName, bookDocument} from '../../infrastructure/inMemory/collections/book';
import {publisherCollectionName, publisherDocument} from '../../infrastructure/inMemory/collections/publisher';
import {tagCollectionName, tagDocument} from '../../infrastructure/inMemory/collections/tag';
import {usingTagCollectionName, usingTagDocument} from '../../infrastructure/inMemory/collections/usingTag';
import {InMemoryDBError} from '../../presentation/error/infrastructure/inMemoryDBError';

export default class InMemoryBookRepository implements IBookRepository {
  db: Db;
  bookCollection;
  authorCollection;
  publisherCollection;
  usingTagCollection;
  tagCollection;
  bulkApilist: bookDocument[] = [];

  constructor(db: Db) {
    this.db = db;
    this.bookCollection = db.collection<bookDocument>(bookCollectionName);
    this.authorCollection = db.collection<authorDocument>(authorCollectionName);
    this.publisherCollection = db.collection<publisherDocument>(publisherCollectionName);
    this.usingTagCollection = db.collection<usingTagDocument>(usingTagCollectionName);
    this.tagCollection = db.collection<tagDocument>(tagCollectionName);
  }

  async save(book: Book): Promise<void> {
    const insertDoc:bookDocument = {
      id: book.Id,
      isbn: book.Isbn,
      book_name: book.Name,
      book_sub_name: book.SubName,
      author_id: book.Author.Id,
      ndc: book.Ndc,
      publisher_id: book.Publisher.Id,
      year: book.Year,
      book_content: book.Content,
    };

    this.bulkApilist.push(insertDoc);
  }

  async deleteAll(): Promise<void> {
    await this.bookCollection.deleteMany({});
  }

  /**
   * ここでは疑似的にlike検索
   */
  async search(
      query: string,
      pageCount: number,
      margin: PaginationMargin,
  ): Promise<{ books: Book[]; count: number; }> {
    const fetchData = (await this.bookCollection.find({book_name: {$regex: query}}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as bookDocument[];
    const fetchCount = await this.bookCollection.count({book_name: {$regex: query}});

    const books:Book[] = await Promise.all(fetchData.map(async (data) => {
      const fetchAuthorData = await this.authorCollection.findOne({id: data.author_id});

      if (fetchAuthorData === null) throw new InMemoryDBError(`Author not found in book id: ${data.id}`);

      const fetchPublisherData = await this.publisherCollection.findOne({id: data.publisher_id});

      if (fetchPublisherData === null) throw new InMemoryDBError(`Publisher not found in book id: ${data.id}`);

      const author = new Author(fetchAuthorData.id, fetchAuthorData.name);
      const publisher = new Publisher(fetchPublisherData.id, fetchPublisherData.name);

      const book = new Book(
          data.id,
          data.book_name,
          data.book_sub_name,
          data.book_content,
          data.isbn,
          data.ndc,
          data.year,
          author,
          publisher,
          await this.getTagsByBookId(data.id),
      );

      return book;
    }));

    return {books, count: fetchCount};
  }

  private async getTagsByBookId(bookId: string):Promise<Tag[]> {
    const usingTagIds = (await this.usingTagCollection.find({book_id: bookId}).toArray()) as usingTagDocument[];

    const tags = await Promise.all(usingTagIds.map(async (item) => {
      const tag = await this.tagCollection.findOne({id: item.tag_id});

      if (tag === null) throw new InMemoryDBError(`Tag not found when find by bookId: ${bookId}`);

      const bookIds = (await this.usingTagCollection.find({tag_id: tag.id}).toArray()) as usingTagDocument[];
      return new Tag(tag.id, tag.name, tag.createdAt, bookIds.map((item) => item.book_id));
    }));

    return tags;
  }

  async executeBulkApi(): Promise<void> {
    await this.bookCollection.insertMany(this.bulkApilist);

    this.bulkApilist = [];
  }

  async searchById(id: BookId): Promise<Book> {
    const res = await this.bookCollection.findOne({id: id.Id});

    if (res === null) throw new InMemoryDBError(`${id.Id} not found in memory db`);

    const fetchAuthor = await this.authorCollection.findOne({id: res.author_id});

    if (fetchAuthor === null) throw new InMemoryDBError(`author not found when find book. bookId: ${id.Id}`);

    const fetchPublisher = await this.publisherCollection.findOne({id: res.publisher_id});

    if (fetchPublisher === null) throw new InMemoryDBError(`publisher not found when find book. bookId: ${id.Id}`);

    const author = new Author(fetchAuthor.id, fetchAuthor.name);
    const publisher = new Publisher(fetchPublisher.id, fetchPublisher.name);
    const tags = await this.getTagsByBookId(id.Id);

    return new Book(
        res.id,
        res.book_name,
        res.book_sub_name,
        res.book_content,
        res.isbn,
        res.ndc,
        res.year,
        author,
        publisher,
        tags,
    );
  }

  async searchUsingLike(words: string, pageCount: number, margin: PaginationMargin): Promise<{ books: Book[]; count: number; }> {
    const fetchData = (await this.bookCollection.find({book_name: {$eq: words}}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as bookDocument[];
    const fetchCount = await this.bookCollection.count({book_name: {$eq: words}});

    const books:Book[] = await Promise.all(fetchData.map(async (data) => {
      const fetchAuthorData = await this.authorCollection.findOne({id: data.author_id});

      if (fetchAuthorData === null) throw new InMemoryDBError(`Author not found in book id: ${data.id}`);

      const fetchPublisherData = await this.publisherCollection.findOne({id: data.publisher_id});

      if (fetchPublisherData === null) throw new InMemoryDBError(`Publisher not found in book id: ${data.id}`);

      const author = new Author(fetchAuthorData.id, fetchAuthorData.name);
      const publisher = new Publisher(fetchPublisherData.id, fetchPublisherData.name);

      const book = new Book(
          data.id,
          data.book_name,
          data.book_sub_name,
          data.book_content,
          data.isbn,
          data.ndc,
          data.year,
          author,
          publisher,
          await this.getTagsByBookId(data.id),
      );

      return book;
    }));

    return {books, count: fetchCount};
  }

  async searchByTag(tagName: string, pageCount: number, margin: PaginationMargin): Promise<{ books: Book[]; count: number; }> {
    const fetchTag = await this.tagCollection.findOne({name: {$eq: tagName}});

    if (fetchTag === null) return {books: [], count: 0};

    const fetchBookIds = (await this.usingTagCollection.find({tag_id: fetchTag.id}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as usingTagDocument[];
    const fetchCount = await this.usingTagCollection.count({tag_id: fetchTag.id});

    const books:Book[] = await Promise.all(fetchBookIds.map(async (fetchId) => {
      const fetchBook = await this.bookCollection.findOne({id: fetchId});

      if (fetchBook === null) throw new InMemoryDBError('Book not found');

      const fetchAuthorData = await this.authorCollection.findOne({id: fetchBook.author_id});

      if (fetchAuthorData === null) throw new InMemoryDBError(`Author not found in book id: ${fetchBook.id}`);

      const fetchPublisherData = await this.publisherCollection.findOne({id: fetchBook.publisher_id});

      if (fetchPublisherData === null) throw new InMemoryDBError(`Publisher not found in book id: ${fetchBook.id}`);

      const author = new Author(fetchAuthorData.id, fetchAuthorData.name);
      const publisher = new Publisher(fetchPublisherData.id, fetchPublisherData.name);

      const book = new Book(
          fetchBook.id,
          fetchBook.book_name,
          fetchBook.book_sub_name,
          fetchBook.book_content,
          fetchBook.isbn,
          fetchBook.ndc,
          fetchBook.year,
          author,
          publisher,
          await this.getTagsByBookId(fetchBook.id),
      );

      return book;
    }));

    return {books, count: fetchCount};
  }

  async update(bookModel: Book): Promise<void> {
    const updateDoc: bookDocument = {
      id: bookModel.Id,
      isbn: bookModel.Isbn,
      book_name: bookModel.Name,
      book_sub_name: bookModel.SubName,
      author_id: bookModel.Author.Id,
      publisher_id: bookModel.Publisher.Id,
      ndc: bookModel.Ndc,
      year: bookModel.Year,
      book_content: bookModel.Content,
    };

    await this.bookCollection.updateOne({id: bookModel.Id}, updateDoc);
  }

  async findAll(pageCount: number, margin: PaginationMargin): Promise<Book[]> {
    const fetchData = (await this.bookCollection.find({}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as bookDocument[];

    if (fetchData === null) return [];

    const books:Book[] = await Promise.all(fetchData.map(async (data) => {
      const fetchAuthorData = await this.authorCollection.findOne({id: data.author_id});

      if (fetchAuthorData === null) throw new InMemoryDBError(`Author not found in book id: ${data.id}`);

      const fetchPublisherData = await this.publisherCollection.findOne({id: data.publisher_id});

      if (fetchPublisherData === null) throw new InMemoryDBError(`Publisher not found in book id: ${data.id}`);

      const author = new Author(fetchAuthorData.id, fetchAuthorData.name);
      const publisher = new Publisher(fetchPublisherData.id, fetchPublisherData.name);

      const book = new Book(
          data.id,
          data.book_name,
          data.book_sub_name,
          data.book_content,
          data.isbn,
          data.ndc,
          data.year,
          author,
          publisher,
          await this.getTagsByBookId(data.id),
      );

      return book;
    }));

    return books;
  }

  async findAllCount(): Promise<number> {
    return await this.bookCollection.count({});
  }

  async deleteBook(book: Book): Promise<void> {
    await this.bookCollection.deleteOne({id: book.Id});
  }

  async searchByForeignId(foreignModel: Author[] | Publisher[], pageCount: number, margin: PaginationMargin): Promise<{ books: Book[]; count: number; }> {
    if (foreignModel.length === 0) return {books: [], count: 0};

    let bookDatas: bookDocument[] = [];
    let count = 0;

    if (foreignModel[0] instanceof Author) {
      const authorIds = foreignModel.map((author) => author.Id);
      bookDatas = (await this.bookCollection.find({author_id: {$in: authorIds}}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as bookDocument[];
      count = await this.bookCollection.count({author_id: {$in: authorIds}});
    } else {
      const publisherIds = foreignModel.map((publisher) =>publisher.Id);
      bookDatas = (await this.bookCollection.find({publisher_id: {$in: publisherIds}}).skip(pageCount * margin.Margin).limit(margin.Margin).toArray()) as bookDocument[];
      count = await this.bookCollection.count({publisher_id: {$in: publisherIds}});
    }

    const books:Book[] = await Promise.all(bookDatas.map(async (data) => {
      const fetchAuthorData = await this.authorCollection.findOne({id: data.author_id});

      if (fetchAuthorData === null) throw new InMemoryDBError(`Author not found in book id: ${data.id}`);

      const fetchPublisherData = await this.publisherCollection.findOne({id: data.publisher_id});

      if (fetchPublisherData === null) throw new InMemoryDBError(`Publisher not found in book id: ${data.id}`);

      const author = new Author(fetchAuthorData.id, fetchAuthorData.name);
      const publisher = new Publisher(fetchPublisherData.id, fetchPublisherData.name);

      const book = new Book(
          data.id,
          data.book_name,
          data.book_sub_name,
          data.book_content,
          data.isbn,
          data.ndc,
          data.year,
          author,
          publisher,
          await this.getTagsByBookId(data.id),
      );

      return book;
    }));

    return {books, count};
  }

  async getDuplicationBooks(): Promise<string[]> {
    /* TODO: テスト環境での実装 */
    return [];
  }

  async checkEqualDbAndEs(): Promise<string[]> {
    return [];
  }

  async checkEqualEsAndDb(): Promise<string[]> {
    return [];
  }
}
