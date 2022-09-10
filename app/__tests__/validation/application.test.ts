import BookRequestApplicationService from '../../src/application/bookRequestApplicationService';
import TestRequestRepository from '../../src/interface/testRepository/testRequestRepository';
import TestDepartmentRepository from '../../src/interface/testRepository/testDepartmentRepository';
import InMemoryDb from '../../src/infrastructure/inMemory/index';
import BookRequestService from '../../src/domain/service/bookRequestService';

describe('Access book request', () => {
  let bookRequestApplicationService: BookRequestApplicationService;
  let inMemoryDb: InMemoryDb;

  beforeAll(async () => {
    inMemoryDb = new InMemoryDb();
    await inMemoryDb.init();

    bookRequestApplicationService = new BookRequestApplicationService(
        new TestRequestRepository(inMemoryDb.db()),
        new TestDepartmentRepository(inMemoryDb.db()),
        new BookRequestService(),
    );
  });

  afterAll(async () => {
    await inMemoryDb.remove();
  });

  it('send and get book request data', async () => {
    const sendData = {
      id: 'test',
      bookName: 'test',
      authorName: 'who',
      publisherName: 'where',
      isbn: '',
      message: '',
      departmentId: 'departmentTest',
      departmentName: 'departmentId',
      schoolYear: '1',
      schoolClass: '3',
      userName: 'test',
    };

    await bookRequestApplicationService.register(
        sendData.id,
        sendData.bookName,
        sendData.authorName,
        sendData.publisherName,
        sendData.isbn,
        sendData.message,
        sendData.departmentId,
        sendData.departmentName,
        sendData.schoolYear,
        sendData.schoolClass,
        sendData.userName,
    );

    const fetchData = await bookRequestApplicationService.findById(sendData.id);

    expect(fetchData?.BookName).toMatch(sendData.bookName);

    await bookRequestApplicationService.delete(sendData.id);
  });
});
