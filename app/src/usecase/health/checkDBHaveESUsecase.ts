import PaginationMargin from "../../domain/model/pagination/paginationMargin";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import CheckDBHaveESOutputData from "../../presentation/dto/health/checkDBHaveES/CheckDBHaveESOutputData";
import {Usecase} from "../Usecase";

export default class CheckDBHaveESUseCase implements Usecase<void, Promise<CheckDBHaveESOutputData>> {
  constructor(private readonly bookDB: IBookDBRepository, private readonly bookES: IBookESRepository) {}


  public async execute(): Promise<CheckDBHaveESOutputData> {
    const MARGIN = 500; // 一度に取得するカラム数
    const bookCount = await this.bookES.count();

    const idList = [];

    for (let i = 0; i < Math.ceil(bookCount / MARGIN); i++) {
      const esIds = await this.bookES.getIds(i * MARGIN, new PaginationMargin(MARGIN, true));

      const ids = esIds.map((book) => book.Id);

      const dbIds = await this.bookDB.findByIds(esIds);

      const dbIdStringList = dbIds.map((id) => id.Id.Id);

      for (const id of ids) if (!dbIdStringList.includes(id)) idList.push(id);
    }

    return new CheckDBHaveESOutputData(idList);
  }
}
