import AuthorModel from '../author/authorModel';
import PublisherModel from '../publisher/publisherModel';
import TagModel from '../tag/tagModel';

import Logger from '../../../infrastructure/logger/logger';

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
  private tags!: TagModel[];

  private readonly MAX_NUMBER_OF_TAGS = 10;

  constructor(
      id: string,
      name: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      author: AuthorModel,
      publisher: PublisherModel,
      tags: TagModel[],
  ) {
    if (id === null) throw new Error('Id is null.');
    if (name === null) throw new Error('The title of the book is null.');

    this.id = id;
    this.Name = name;
    this.SubName = subName;
    this.Content = content;
    this.Isbn = isbn;
    this.Ndc = ndc;
    this.Year = year;

    this.author = author;
    this.publisher = publisher;
    this.tags = tags;
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
    if (isbn === '' || isbn === null || isbn.length < 10) {
      logger.warn('There are not enough digits in isbn.');
      this.isbn = null;
      return;
    }

    this.isbn = isbn;
  }

  get Ndc(): number | null {
    return this.ndc;
  }

  private set Ndc(ndc: number | null) {
    if (ndc !== null && ndc.toString().length < 1) {
      logger.warn('NDC format is incorrect; set to NULL.');
      this.ndc = null;
      return;
    }
  }

  get Year(): number | null {
    return this.year;
  }
  private set Year(year: number | null) {
    if (year !== null && year.toString().length < 4) {
      logger.warn('Year format is incorrect; set to NULL.');
      year = null;
      return;
    }

    this.year = year;
  }

  get Author(): AuthorModel {
    return this.author;
  }

  get Publisher(): PublisherModel {
    return this.publisher;
  }

  get Tags(): TagModel[] {
    return this.tags;
  }

  public changeName(name: string | null) {
    if (name === null) throw new Error('The book title is null.');

    this.Name = name;
  }

  public changeSubName(subName: string | null) {
    this.SubName = subName;
  }

  public changeContent(content: string |null) {
    this.Content = content;
  }

  public changeIsbn(isbn: string | null) {
    this.Isbn = isbn;
  }

  public changeNdc(ndc: number | null) {
    this.Ndc = ndc;
  }

  public changeYear(year: number | null) {
    this.Year = year;
  }

  public isOverNumberOfTags() {
    return this.tags.length > this.MAX_NUMBER_OF_TAGS;
  }
}
