import {IBookImgRepository} from "../../../domain/repository/bookImg/IBookImgRepository";
import {getImgLink} from "../fetchImgFunc";

export default class BookImgOpenDBRepository implements IBookImgRepository {
  public async fetchBookImg(isbn: string): Promise<string | null> {
    return await getImgLink(isbn);
  }
}
