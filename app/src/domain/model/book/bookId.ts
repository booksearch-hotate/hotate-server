export default class BookId {
  private id: string;

  constructor(id: string) {
    if (typeof id !== 'string' || id.length === 0 || id.length > 36) throw new Error('Invalid book id.');

    this.id = id;
  }

  get Id() {
    return this.id;
  }
}
