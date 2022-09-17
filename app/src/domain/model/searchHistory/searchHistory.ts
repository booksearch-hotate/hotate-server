import {DomainInvalidError} from '../../../presentation/error';

export default class SearchHistory {
  private words: string;
  private id: string;
  private createdAt: Date;

  public constructor(id:string, words: string, createdAt: Date) {
    if (words === undefined) throw new DomainInvalidError('keywords of history of search is unknown.');
    if (id === undefined) throw new DomainInvalidError('id of history of search is unknown.');
    if (createdAt === undefined) throw new DomainInvalidError('date of create of history of search is unknown.');

    this.words = words;
    this.id = id;
    this.createdAt = new Date(createdAt);
  }

  get Words(): string {
    return this.words;
  }

  get Id(): string {
    return this.id;
  }

  get CreatedAt(): Date {
    return this.createdAt;
  }
}
