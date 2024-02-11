import TagId from "../../domain/model/tag/tagId";
import {ITagDBRepository} from "../../domain/repository/db/ITagDBRepository";
import TagDeleteInputData from "../../presentation/dto/tag/delete/TagDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteTagUseCase implements Usecase<TagDeleteInputData, Promise<void>> {
  constructor(private readonly tagDB: ITagDBRepository) {}

  public async execute(input: TagDeleteInputData): Promise<void> {
    const tag = await this.tagDB.findById(new TagId(input.id));

    if (tag === null) throw new Error("タグが見つかりませんでした。");

    await this.tagDB.delete(tag);
  }
}
