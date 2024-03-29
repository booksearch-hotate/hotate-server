import Book from "../../../domain/model/book/book";

export default class BookData {
  private VIEW_BOOK_CONTENT_LENGTH = 100;

  private id: string;
  private bookName: string;
  private bookSubName: string | null;
  private authorName: string;
  private authorId: string;
  private publisherName: string;
  private publisherId: string;
  private bookContent!: string;
  private imgLink: string | null;
  private isbn: string | null;
  private year: number | null;
  private ndc: number | null;
  private tags: string[] = [];

  public constructor(book: Book) {
    this.id = book.Id.Id;
    this.bookName = book.Name;
    this.authorName = book.Author.Name === null ? "" : book.Author.Name;
    this.publisherName = book.Publisher.Name === null ? "" : book.Publisher.Name;
    this.BookContent = book.Content === null ? "" : book.Content;
    this.bookSubName = book.SubName;
    this.imgLink = null;
    this.isbn = book.Isbn;
    this.year = book.Year;
    this.ndc = book.Ndc;
    this.authorId = book.Author.Id.Id;
    this.publisherId = book.Publisher.Id.Id;

    book.Tags.forEach((tag) => this.tags.push(tag.Name));
  }

  get Id(): string {
    return this.id;
  }
  get BookName(): string {
    return this.bookName;
  }
  get BookSubName(): string | null {
    return this.bookSubName;
  }
  get AuthorName(): string {
    return this.authorName;
  }
  get PublisherName(): string {
    return this.publisherName;
  }
  set BookContent(content: string) {
    this.bookContent = content;
  }
  get BookContent(): string {
    return this.bookContent;
  }
  set Isbn(isbn: string | null) {
    this.isbn = isbn;
  }
  get Isbn(): string | null {
    return this.isbn;
  }

  set ImgLink(link: string | null) {
    this.imgLink = link;
  }
  get ImgLink(): string | null {
    return this.imgLink;
  }

  get Year(): number | null {
    return this.year;
  }
  get Ndc(): number | null {
    return this.ndc;
  }

  get AuthorId(): string {
    return this.authorId;
  }

  get PublisherId(): string {
    return this.publisherId;
  }

  get Tags(): string[] {
    return this.tags;
  }

  public convertBookContentLength() {
    if (this.bookContent.length > this.VIEW_BOOK_CONTENT_LENGTH) {
      this.bookContent = `${this.bookContent.slice(0, this.VIEW_BOOK_CONTENT_LENGTH)}...`;
    }
  }
}
