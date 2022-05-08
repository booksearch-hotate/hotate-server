import BookModel from "../../domain/model/bookModel";

export default class BookData {
  private id: string
  private bookName: string
  private authorName: string
  private publisherName: string
  private bookContent!: string

  public constructor (book: BookModel) {
    this.id = book.Id
    this.bookName = book.Name
    this.authorName = book.Author.Name
    this.publisherName = book.Publisher.Name
    this.BookContent = book.Content === null ? '' : book.Content
  }

  get Id (): string { return this.id }
  get BookName (): string { return this.bookName }
  get AuthorName (): string { return this.authorName }
  get PublisherName (): string { return this.publisherName }
  set BookContent (content: string) {
    const sliceStrLengh = 50
    if (content.length > sliceStrLengh) this.bookContent = content.substring(0, sliceStrLengh) + '...'
    else this.bookContent = content
  }
  get BookContent (): string { return this.bookContent }
}
