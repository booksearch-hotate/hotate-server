import {IBookESRepository} from "../../domain/repository/es/IBookESRepository";
import DeleteESByDBInputData from "../../presentation/dto/health/deleteESByDB/DeleteESByDBInputData";
import {Usecase} from "../Usecase";

export default class DeleteESByDBUseCase implements Usecase<DeleteESByDBInputData, Promise<void>> {
  constructor(private readonly bookES: IBookESRepository) {}

  public async execute(input: DeleteESByDBInputData): Promise<void> {
    const ids = input.ids;

    const books = await this.bookES.findByDBIds(ids);

    await this.bookES.deleteMany(books);
  }
}
