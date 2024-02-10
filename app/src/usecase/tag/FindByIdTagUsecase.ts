import TagId from "../../domain/model/tag/tagId";
import {ITagDBRepository} from "../../domain/repository/db/ITagDBRepository";
import TagFindByIdInputData from "../../presentation/dto/tag/findById/TagFindByIdInputData";
import TagFindByIdOutputData from "../../presentation/dto/tag/findById/TagFindByIdOutputData";
import {Usecase} from "../Usecase";

export default class FindByIdTagUseCase implements Usecase<TagFindByIdInputData, Promise<TagFindByIdOutputData>> {
  constructor(private readonly tagDB: ITagDBRepository) {}

  public async execute(input: TagFindByIdInputData): Promise<TagFindByIdOutputData> {
    const tag = await this.tagDB.findById(new TagId(input.id));

    if (tag === null) throw new Error("タグが見つかりませんでした。");

    return new TagFindByIdOutputData(tag);
  }
}
