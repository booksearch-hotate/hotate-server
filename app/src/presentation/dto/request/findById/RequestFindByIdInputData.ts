import BookRequestId from "../../../../domain/model/bookRequest/bookRequestId";

export default class RequestFindByIdInputData {
  public id: BookRequestId;

  constructor(id: string) {
    this.id = new BookRequestId(id);
  }
}
