import {v4 as uuidv4} from "uuid";

export default class BookRequestId {
  private id: string;

  public constructor(id: string | null) {
    this.id = id === null ? uuidv4() : id;
  }

  get Id() {
    return this.id;
  }
}
