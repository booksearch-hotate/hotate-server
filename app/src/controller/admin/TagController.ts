import TagDeleteInputData from "../../presentation/dto/tag/delete/TagDeleteInputData";
import TagFindByIdInputData from "../../presentation/dto/tag/findById/TagFindByIdInputData";
import TagUpdateInputData from "../../presentation/dto/tag/update/TagUpdateInputData";
import TagDeleteResponse from "../../presentation/response/tag/TagDeleteResponse";
import TagEditResponse from "../../presentation/response/tag/TagEditResponse";
import TagIndexResponse from "../../presentation/response/tag/TagIndexResponse";
import TagUpdateResponse from "../../presentation/response/tag/TagUpdateResponse";
import DeleteTagUseCase from "../../usecase/tag/DeleteTagUsecase";
import FindAllTagUseCase from "../../usecase/tag/FindAllTagUsecase";
import FindByIdTagUseCase from "../../usecase/tag/FindByIdTagUsecase";
import UpdateTagUseCase from "../../usecase/tag/UpdateTagUsecase";

export default class TagAdminController {
  constructor(
    private readonly findAllTagUsecase: FindAllTagUseCase,
    private readonly deleteTagUsecase: DeleteTagUseCase,
    private readonly findByIdTagUsecase: FindByIdTagUseCase,
    private readonly updateTagUsecase: UpdateTagUseCase,
  ) {}

  public async index(): Promise<TagIndexResponse> {
    const response = new TagIndexResponse();

    try {
      const output = await this.findAllTagUsecase.execute();

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async delete(id: string): Promise<TagDeleteResponse> {
    const response = new TagDeleteResponse();

    try {
      const input = new TagDeleteInputData(id);
      await this.deleteTagUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }

  public async edit(id: string): Promise<TagEditResponse> {
    const response = new TagEditResponse();

    try {
      const input = new TagFindByIdInputData(id);
      const output = await this.findByIdTagUsecase.execute(input);

      return response.success(output);
    } catch (e) {
      return response.error();
    }
  }

  public async update(id: string, name: string): Promise<TagUpdateResponse> {
    const response = new TagUpdateResponse();

    try {
      const input = new TagUpdateInputData(id, name);
      await this.updateTagUsecase.execute(input);

      return response.success();
    } catch (e) {
      return response.error();
    }
  }
}
