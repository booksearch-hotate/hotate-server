import AuthorModel from './authorModel';
import PublisherModel from './publisherModel';

import Logger from '../../infrastructure/logger/logger';

const logger = new Logger('BookModel');

export default class BookModel {
  private id: string;
  private name!: string;
  private subName!: string | null;
  private content!: string | null;
  private isbn!: string | null;
  private ndc!: number | null;
  private year!: number | null;
  private author!: AuthorModel;
  private publisher!: PublisherModel;

  public constructor(
      id: string,
      name: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      author: AuthorModel,
      publisher: PublisherModel,
  ) {
    if (id === null) throw new Error('idがnullです');

    this.id = id;
    this.Name = name;
    this.SubName = subName;
    this.Content = content;
    this.Isbn = isbn;
    this.Ndc = ndc;
    this.Year = year;

    this.author = author;
    this.publisher = publisher;
  }

  get Id(): string {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }
  set Name(name: string) {
    if (name === null) {
      console.warn('The name property of books is empty.');
      this.name = '';
    } else {
      this.name = name;
    }
  }

  get SubName(): string | null {
    return this.subName;
  }
  set SubName(subName: string | null) {
    this.subName = subName;
  }

  get Content(): string | null {
    return this.content;
  }
  set Content(content: string | null) {
    this.content = content;
  }

  get Isbn(): string | null {
    return this.isbn;
  }
  set Isbn(isbn: string | null) {
    if (isbn === '') isbn = null;
    if (isbn !== null && isbn.length < 10) {
      console.warn(`ISBNの桁数が足りません${isbn} ${typeof isbn}`);
      isbn = null;
    }
    // もしもisbnが13桁でハイフンがない場合はハイフンを追加する
    if (isbn !== null && isbn.length === 13 && isbn.indexOf('-') === -1) {
      const firstNum = isbn.substring(0, 3);
      const contryCode = isbn.substring(3, 4);
      const publisherNum = isbn.substring(4, 8);
      const bookNum = isbn.substring(8, 12);
      const checkDigit = isbn.substring(12, 13);
      this.isbn = [
        firstNum,
        contryCode,
        publisherNum,
        bookNum,
        checkDigit,
      ].join('-');
    } else if (isbn !== null) {
      if (isbn.indexOf('-') !== -1) {
        const num = isbn.replace(/-/g, '');
        if (num.length !== 13) this.isbn = null;
      } else {
        this.isbn = null;
      }
    }
  }

  get Ndc(): number | null {
    return this.ndc;
  }
  set Ndc(ndc: number | null) {
    if (ndc !== null && ndc.toString().length < 1) {
      logger.warn('NDC format is incorrect; set to NULL.');
      ndc = null;
    }
    this.ndc = ndc;
  }

  get Year(): number | null {
    return this.year;
  }
  set Year(year: number | null) {
    if (year !== null && year.toString().length < 4) {
      logger.warn('Year format is incorrect; set to NULL.');
      year = null;
    }
    this.year = year;
  }

  get Author(): AuthorModel {
    return this.author;
  }

  get Publisher(): PublisherModel {
    return this.publisher;
  }
}
