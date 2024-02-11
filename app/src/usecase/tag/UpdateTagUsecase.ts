import TagId from "../../domain/model/tag/tagId";
import {ITagDBRepository} from "../../domain/repository/db/ITagDBRepository";
import TagUpdateInputData from "../../presentation/dto/tag/update/TagUpdateInputData";
import {Usecase} from "../Usecase";

export default class UpdateTagUseCase implements Usecase<TagUpdateInputData, Promise<void>> {
  constructor(private tagDB: ITagDBRepository) {}

  public async execute(input: TagUpdateInputData): Promise<void> {
    const tag = await this.tagDB.findById(new TagId(input.id));

    if (tag === null) throw new Error("タグが見つかりませんでした。");

    tag.changeName(input.name);

    await this.tagDB.update(tag);
  }
}
