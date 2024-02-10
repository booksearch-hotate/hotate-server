import PaginationMargin from "../../domain/model/pagination/paginationMargin";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import CheckESHaveDBOutputData from "../../presentation/dto/health/checkESHaveDB/CheckESHaveDBOutputData";
import {Usecase} from "../Usecase";

export default class CheckESHaveDBUsecase implements Usecase<void, Promise<CheckESHaveDBOutputData>> {
  constructor(private readonly bookDB: IBookDBRepository, private readonly bookES: IBookESRepository) {}

  public async execute(): Promise<CheckESHaveDBOutputData> {
    const MARGIN = 500; // 一度に取得するカラム数

    const bookCount = await this.bookDB.countAll();

    const idList = [];

    for (let i = 0; i < Math.ceil(bookCount / MARGIN); i++) {
      const books = await this.bookDB.findAll(i, new PaginationMargin(MARGIN, true));

      const ids = books.map((book) => book.Id.Id);

      const esIds = await this.bookES.findByDBIds(ids);


      for (const id of ids) if (!esIds.includes(id)) idList.push(id);
    }

    return new CheckESHaveDBOutputData(idList);
  }
}
