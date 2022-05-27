import BookModel from '../../domain/model/bookModel';

export default class BookData {
  private id: string;
  private bookName: string;
  private authorName: string | null;
  private publisherName: string | null;
  private bookContent!: string;
  private imgLink: string | null;
  private isbn: string | null;

  public constructor(book: BookModel) {
    this.id = book.Id;
    this.bookName = book.Name;
    this.authorName = book.Author.Name;
    this.publisherName = book.Publisher.Name;
    this.BookContent = book.Content === null ? '' : book.Content;
    this.imgLink = null;
    this.isbn = book.Isbn;
  }

  get Id(): string {
    return this.id;
  }
  get BookName(): string {
    return this.bookName;
  }
  get AuthorName(): string | null {
    return this.authorName;
  }
  get PublisherName(): string | null {
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
}
