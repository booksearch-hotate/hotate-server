import BookId from "../../model/book/bookId";
import Tag from "../../model/tag/tag";
import TagId from "../../model/tag/tagId";

export interface ITagDBRepository {
  create(tag: Tag): Promise<void>;
  findByName(name: string): Promise<Tag | null>;
  isExistCombination(tagId: TagId, bookId: BookId): Promise<boolean>;
  saveCombination(tagId: TagId, bookId: BookId): Promise<void>;
  countById(tagId: TagId): Promise<number>;
  findAll(): Promise<Tag[]>;
  delete(tag: Tag): Promise<void>;
  findById(id: TagId): Promise<Tag | null>;
  update(tag: Tag): Promise<void>;
}
