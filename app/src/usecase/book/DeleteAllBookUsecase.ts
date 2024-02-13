import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import {Usecase} from "../Usecase";

export default class DeleteAllBookUseCase implements Usecase<void, Promise<void>> {
  private bookDB: IBookDBRepository;
  private bookES: IBookESRepository;

  public constructor(bookDB: IBookDBRepository, bookES: IBookESRepository) {
    this.bookDB = bookDB;
    this.bookES = bookES;
  }

  public async execute(input: void): Promise<void> {
    await Promise.all([this.bookDB.deleteAll(), this.bookES.deleteAll()]);
  }
}
