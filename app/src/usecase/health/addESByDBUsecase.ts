import BookId from "../../domain/model/book/bookId";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import AddESByDBInputData from "../../presentation/dto/health/addESByDB/AddESByDBInputData";
import {Usecase} from "../Usecase";

export default class AddESByDBUseCase implements Usecase<AddESByDBInputData, Promise<void>> {
  constructor(private readonly bookDB: IBookDBRepository, private readonly bookES: IBookESRepository) {}

  public async execute(input: AddESByDBInputData): Promise<void> {
    const ids = input.ids;

    const books = await this.bookDB.findByIds(ids.map((id: string) => new BookId(id)));

    await this.bookES.saveMany(books);
  }
}
