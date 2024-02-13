import {DomainInvalidError} from "../../../presentation/error";
import Author from "../author/author";
import Publisher from "../publisher/publisher";
import Tag from "../tag/tag";
import BookId from "./bookId";

export default class Book {
  private id: BookId;
  private name!: string;
  private subName!: string | null;
  private content!: string | null;
  private isbn!: string | null;
  private ndc!: number | null;
  private year!: number | null;
  private author!: Author;
  private publisher!: Publisher;
  private tags!: Tag[];

  private readonly MAX_NUMBER_OF_TAGS = 10;
  private readonly MAX_NAME_LEN = 150;
  private readonly MAX_SUBNAME_LEN = 300;
  private readonly MAX_CONTENT_LEN = 1000;
  private readonly MAX_YEAR_LEN = 4;
  private readonly MAX_ISBN_LEN = 10;

  constructor(
      id: BookId,
      name: string,
      subName: string | null,
      content: string | null,
      isbn: string | null,
      ndc: number | null,
      year: number | null,
      author: Author,
      publisher: Publisher,
      tags: Tag[],
  ) {
    if (id === null) throw new DomainInvalidError("idがnullです。");
    if (name === null || name.length > this.MAX_NAME_LEN) throw new DomainInvalidError(`本のタイトルの文字数は1文字以上${this.MAX_NAME_LEN}文字未満にしてください。`);
    if (subName !== null && name.length > this.MAX_SUBNAME_LEN) throw new DomainInvalidError(`本のサブタイトルの文字数は1文字以上${this.MAX_SUBNAME_LEN}文字未満にしてください。`);
    if (content !== null && content.length > this.MAX_CONTENT_LEN) throw new DomainInvalidError(`本の内容の文字数は1文字以上${this.MAX_CONTENT_LEN}文字未満にしてください。`);

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

  get Id(): BookId {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }
  set Name(name: string) {
    if (name === null) {
      this.name = "";
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
    if (isbn === "" || isbn === null || isbn.length < this.MAX_ISBN_LEN) {
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
      this.ndc = null;
      return;
    }
  }

  get Year(): number | null {
    return this.year;
  }
  private set Year(year: number | null) {
    if (year !== null && year.toString().length < this.MAX_YEAR_LEN) {
      year = null;
      return;
    }

    this.year = year;
  }

  get Author(): Author {
    return this.author;
  }

  get Publisher(): Publisher {
    return this.publisher;
  }

  get Tags(): Tag[] {
    return this.tags;
  }

  public changeName(name: string | null) {
    if (name === null) throw new DomainInvalidError("The book title is null.");

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

  public changeAuthor(author: Author) {
    this.author = author;
  }

  public changePublisher(publisher: Publisher) {
    this.publisher = publisher;
  }
}
