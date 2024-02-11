import {ITagDBRepository} from "../../domain/repository/db/ITagDBRepository";
import TagFindAllOutputData from "../../presentation/dto/tag/findAll/TagFindAllOutputData";
import {Usecase} from "../Usecase";

export default class FindAllTagUseCase implements Usecase<void, Promise<TagFindAllOutputData>> {
  constructor(private readonly tagDB: ITagDBRepository) {}

  public async execute(): Promise<TagFindAllOutputData> {
    const output = await this.tagDB.findAll();

    return new TagFindAllOutputData(output);
  }
}
