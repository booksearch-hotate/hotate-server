import {v4 as uuidv4} from 'uuid';

export default class BookRequestService {
  public createUUID(): string {
    return uuidv4();
  }
}
