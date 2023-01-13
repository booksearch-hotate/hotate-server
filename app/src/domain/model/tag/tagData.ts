<<<<<<< HEAD
import {conversionDateToString} from '../../../utils/conversionDate';
=======
import conversionDate from '../../../utils/conversionDate';
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
import Tag from './tag';

export default class TagData {
  private id: string;
  private name: string;
  private createdAt: string | null;
  private bookIds: string[];

  public constructor(tagModel: Tag) {
    this.id = tagModel.Id;
    this.name = tagModel.Name;
<<<<<<< HEAD
    this.createdAt = tagModel.CreatedAt !== null ? conversionDateToString(tagModel.CreatedAt) : null;
=======
    this.createdAt = tagModel.CreatedAt !== null ? conversionDate(tagModel.CreatedAt) : null;
>>>>>>> 5a829ed21201bfdcebade0462cd2d5c5fd998194
    this.bookIds = tagModel.BookIds;
  }

  get Id(): string {
    return this.id;
  }
  get Name(): string {
    return this.name;
  }
  get CreatedAt(): string | null {
    return this.createdAt;
  }
  get BookIds(): string[] {
    return this.bookIds;
  }
}
