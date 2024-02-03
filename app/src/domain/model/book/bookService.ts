import {v4 as uuidv4} from 'uuid';

export default class BookService {
  public createUUID(): string {
    return uuidv4();
  }
}
