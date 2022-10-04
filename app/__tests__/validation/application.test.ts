import BookRequestApplicationService from '../../src/application/bookRequestApplicationService';
import DepartmentApplicationService from '../../src/application/departmentApplicationService';
import InMemoryRequestRepository from '../../src/interface/test/inMemoryRequestRepository';
import InMemoryDepartmentRepository from '../../src/interface/test/inMemoryDepartmentRepository';
import InMemoryDb from '../../src/infrastructure/inMemory/index';
import BookRequestService from '../../src/domain/service/bookRequestService';
import DepartmentService from '../../src/domain/service/departmentService';

describe('Access book request', () => {
  let bookRequestApplicationService: BookRequestApplicationService;
  let inMemoryDb: InMemoryDb;
  let departmentApplicationService: DepartmentApplicationService;

  beforeAll(async () => {
    inMemoryDb = new InMemoryDb();
    await inMemoryDb.init();

    bookRequestApplicationService = new BookRequestApplicationService(
        new InMemoryRequestRepository(inMemoryDb.db()),
        new InMemoryDepartmentRepository(inMemoryDb.db()),
        new BookRequestService(),
    );

    departmentApplicationService = new DepartmentApplicationService(
        new InMemoryDepartmentRepository(inMemoryDb.db()),
        new InMemoryRequestRepository(inMemoryDb.db()),
        new DepartmentService(new InMemoryDepartmentRepository(inMemoryDb.db())),
    );
  });

  afterAll(async () => {
    await inMemoryDb.remove();
  });

  it('Add department', async () => {
    const departmentName = 'Research on Human Destruction';

    await departmentApplicationService.insertDepartment(departmentName);
  });

  it('CRUD flow of request of book.', async () => {
    const departmentList = await departmentApplicationService.findAllDepartment();
    const instanceDepartment = departmentList[Math.floor(Math.random() * departmentList.length)];

    const sendData = {
      id: 'test',
      bookName: 'test',
      authorName: 'who',
      publisherName: 'where',
      isbn: '',
      message: '',
      departmentId: instanceDepartment.Id,
      departmentName: instanceDepartment.Name,
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

    const fetchAfterDeleteData = await bookRequestApplicationService.findAll();

    expect(fetchAfterDeleteData.length).toBe(0);
  });
});
