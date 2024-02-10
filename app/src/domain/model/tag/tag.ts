import {DomainInvalidError} from "../../../presentation/error";
import TagId from "./tagId";

export default class Tag {
  private id: TagId;
  private name: string;
  private createdAt: Date | null;
  private bookIds: string[];

  public constructor(
      id: TagId,
      name: string | undefined,
      createdAt: Date | null,
      bookIds: string[],
  ) {
    if (name === undefined) throw new DomainInvalidError("Unknown to passwords of tag");

    if (name === "") throw new DomainInvalidError("name of tag is empty");

    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.bookIds = bookIds;
  }

  get Id(): TagId {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get CreatedAt(): Date | null {
    return this.createdAt;
  }
  get BookIds(): string[] {
    return this.bookIds;
  }

  public changeName(name: string | null) {
    if (name === null) throw new DomainInvalidError("The tag name is null.");

    this.name = name;
  }
}
