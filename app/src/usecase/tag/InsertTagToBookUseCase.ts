import Tag from "../../domain/model/tag/tag";
import TagId from "../../domain/model/tag/tagId";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {ITagDBRepository} from "../../domain/repository/db/ITagDBRepository";
import TagService from "../../domain/service/tagService";
import UsecaseException from "../../exception/UsecaseException";
import TagInsertInputData from "../../presentation/dto/tag/insertToBook/TagInsertInputData";
import TagInsertOutputData from "../../presentation/dto/tag/insertToBook/TagInsertOutputData";
import {Usecase} from "../Usecase";

export default class InsertTagToBookUseCase implements Usecase<TagInsertInputData, Promise<TagInsertOutputData>> {
  private tagDB: ITagDBRepository;
  private tagService: TagService;
  private bookDB: IBookDBRepository;

  public constructor(
      tagDB: ITagDBRepository,
      tagService: TagService,
      bookDB: IBookDBRepository,
  ) {
    this.tagDB = tagDB;
    this.tagService = tagService;
    this.bookDB = bookDB;
  }

  public async execute(input: TagInsertInputData): Promise<TagInsertOutputData> {
    const fetchData = await this.bookDB.findById(input.bookId);

    if (fetchData === null) throw new UsecaseException(`The bookId: ${input.bookId} is not found.`);

    const book = fetchData.book;

    if (book.isOverNumberOfTags()) throw new UsecaseException("The maximum number of tags that can be added to a tag has been exceeded.");

    let tag = new Tag(new TagId(null), input.name, null, [input.bookId.Id]);

    const isExist = await this.tagService.isExist(tag);

    let isExistCombination = false;

    if (!isExist) {
      await this.tagDB.create(tag);
    } else {
      const alreadyTag = await this.tagDB.findByName(tag.Name);

      if (alreadyTag === null) throw new UsecaseException("The tag should already exist, but could not find it.");

      tag = alreadyTag;

      isExistCombination = await this.tagDB.isExistCombination(tag.Id, input.bookId);
    }
    if (!isExistCombination) await this.tagDB.saveCombination(tag.Id, input.bookId);

    return new TagInsertOutputData(isExistCombination);
  }
}
