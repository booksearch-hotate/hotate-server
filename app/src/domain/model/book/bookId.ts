import {DomainInvalidError} from '../../../presentation/error';

export default class BookId {
  private id: string;

  constructor(id: string) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 36) throw new DomainInvalidError(`本IDが不正な値です。 現在の本ID: ${id}`);

    this.id = id;
  }

  get Id() {
    return this.id;
  }
}
