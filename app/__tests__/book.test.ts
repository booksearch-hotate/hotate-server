import InMemoryDb from '../src/infrastructure/inMemory/index';

import BookApplicationService from '../src/application/bookApplicationService';
import AuthorApplicationService from '../src/application/authorApplicationService';
import PublisherApplicationService from '../src/application/publisherApplicationService';
import TagApplicationService from '../src/application/tagApplicationService';

import InMemoryBookRepository from '../src/interface/test/inMemoryBookRepository';
import InMemoryAuthorRepository from '../src/interface/test/inMemoryAuthorRepository';
import InMemoryPublisherRepository from '../src/interface/test/inMemoryPublisherRepository';
import InMemoryTagRepository from '../src/interface/test/inMemoryTagRepository';

import BookService from '../src/domain/service/bookService';
import AuthorService from '../src/domain/service/authorService';
import PublisherService from '../src/domain/service/publisherService';
import TagService from '../src/domain/service/tagService';

describe('Access book request', () => {
  let inMemoryDb: InMemoryDb;
  let bookApplicationService: BookApplicationService;
  let authorApplicationService: AuthorApplicationService;
  let publisherApplicationService: PublisherApplicationService;
  let tagApplicationService: TagApplicationService;

  const mockData = {
    authorName: 'test Author',
    publisherName: 'test Publisher',
    book: {
      id: '',
      name: '本の題名となります',
      subName: '副題',
      content: 'これは本の内容です。テストに成功するといいな。けど本当のテストって失敗するからこそテストになり得ますよね',
      isbn: '',
      ndc: undefined,
      year: 2022,
    },
    /* 必ず1つだけ重複させること！ */
    tags: [
      'My name is 韻マン',
      'ジャップとジャックの11バック',
      'My name is 韻マン',
    ],
  };

  beforeAll(async () => {
    inMemoryDb = new InMemoryDb();
    await inMemoryDb.init();

    bookApplicationService = new BookApplicationService(
        new InMemoryBookRepository(inMemoryDb.db()),
        new InMemoryAuthorRepository(inMemoryDb.db()),
        new InMemoryPublisherRepository(inMemoryDb.db()),
        new BookService(),
    );

    authorApplicationService = new AuthorApplicationService(
        new InMemoryAuthorRepository(inMemoryDb.db()),
        new AuthorService(new InMemoryAuthorRepository(inMemoryDb.db())),
    );

    publisherApplicationService = new PublisherApplicationService(
        new InMemoryPublisherRepository(inMemoryDb.db()),
        new PublisherService(new InMemoryPublisherRepository(inMemoryDb.db())),
    );

    tagApplicationService = new TagApplicationService(
        new InMemoryTagRepository(inMemoryDb.db()),
        new InMemoryBookRepository(inMemoryDb.db()),
        new TagService(new InMemoryTagRepository(inMemoryDb.db())),
    );
  });

  it('add new book with new author and new publisher, then fetch it.', async () => {
    const authorId = await authorApplicationService.createAuthor(mockData.authorName, false);
    const publisherId = await publisherApplicationService.createPublisher(mockData.publisherName, false);

    await bookApplicationService.createBook(
        mockData.book.name,
        mockData.book.subName,
        mockData.book.content,
        mockData.book.isbn,
        mockData.book.ndc,
        mockData.book.year,
        authorId,
        mockData.authorName,
        publisherId,
        mockData.publisherName,
        false,
    );

    const book = await bookApplicationService.searchBooks(
        mockData.book.name,
        'none',
        'book',
        0,
        20,
    );

    mockData.book.id = book.books[0].Id;

    expect(book.books[0].BookName).toBe(mockData.book.name);

    expect(book.books[0].AuthorName).toBe(mockData.authorName);

    expect(book.books[0].PublisherName).toBe(mockData.publisherName);
  });

  it('Add new tags to the book just added, then fetch them.', async () => {
    const addRes = await Promise.all(mockData.tags.map(async (tagName) => await tagApplicationService.create(tagName, mockData.book.id)));

    expect(addRes).toStrictEqual([false, false, true]);

    const book = await bookApplicationService.searchBookById(mockData.book.id);

    expect(book.Tags.length).toBe(mockData.tags.length - 1);
  });

  afterAll(async () => {
    await inMemoryDb.remove();
  });
});
